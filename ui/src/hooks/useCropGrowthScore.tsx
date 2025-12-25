import { useCallback, useEffect, useState } from "react";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "./useInMemoryStorage";

// Contract ABI
const CropGrowthScoreABI = [
  "function submitScore(address farmerAddress, bytes32 encryptedScore, bytes calldata inputProof) external",
  "function getScoreEntry(uint256 entryId) external view returns (bytes32 encryptedScore, uint256 timestamp, address farmerAddress)",
  "function getFarmerEntries(address farmerAddress) external view returns (uint256[] memory)",
  "function hasEntries(address farmerAddress) external view returns (bool)",
  "function getTotalEntries() external view returns (uint256)",
  "event ScoreSubmitted(address indexed technician, address indexed farmer, uint256 entryId, uint256 timestamp)",
] as const;

interface ScoreEntry {
  entryId: number;
  timestamp: number;
  encryptedScore: string;
  decryptedScore?: number;
}

interface UseCropGrowthScoreState {
  contractAddress: string | undefined;
  entries: ScoreEntry[];
  isLoading: boolean;
  message: string | undefined;
  submitScore: (farmerAddress: string, score: number) => Promise<void>;
  decryptScore: (entryId: number) => Promise<void>;
  loadEntries: () => Promise<void>;
}

export function useCropGrowthScore(
  contractAddress: string | undefined
): UseCropGrowthScoreState {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [ethersSigner, setEthersSigner] = useState<
    ethers.JsonRpcSigner | undefined
  >(undefined);
  const [ethersProvider, setEthersProvider] = useState<
    ethers.JsonRpcProvider | undefined
  >(undefined);

  // Get EIP1193 provider from wallet
  const eip1193Provider = useCallback(() => {
    if (walletClient?.transport) {
      const transport = walletClient.transport as any;
      if (transport.value && typeof transport.value.request === "function") {
        return transport.value;
      }
      if (typeof transport.request === "function") {
        return transport;
      }
    }
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return undefined;
  }, [walletClient]);

  // Initialize FHEVM
  const { instance: fhevmInstance, status: fhevmStatus } = useFhevm({
    provider: eip1193Provider(),
    chainId,
    initialMockChains: { 31337: "http://localhost:8545" },
    enabled: isConnected && !!contractAddress,
  });

  // Convert walletClient to ethers signer
  useEffect(() => {
    if (!walletClient || !chainId) {
      setEthersSigner(undefined);
      setEthersProvider(undefined);
      return;
    }

    const setupEthers = async () => {
      try {
        // Always use wallet client provider to ensure wallet interaction
        const provider = new ethers.BrowserProvider(walletClient as any);
        const signer = await provider.getSigner();
        setEthersProvider(provider as any);
        setEthersSigner(signer);
        console.log("[useCropGrowthScore] Using wallet connection for account:", await signer.getAddress());
      } catch (error) {
        console.error("[useCropGrowthScore] Error setting up ethers:", error);
        setEthersSigner(undefined);
        setEthersProvider(undefined);
      }
    };

    setupEthers();
  }, [walletClient, chainId]);

  const submitScore = useCallback(
    async (farmerAddress: string, score: number) => {
      if (!contractAddress) {
        throw new Error("Contract address not set");
      }

      if (!fhevmInstance) {
        throw new Error("FHEVM instance not available");
      }

      if (!address) {
        throw new Error("Wallet address not available");
      }

      if (!ethersProvider) {
        throw new Error("Ethers provider not available");
      }

      if (score < 0 || score > 10) {
        throw new Error("Score must be between 0 and 10");
      }

      // Validate farmer address is not the contract address
      if (contractAddress && farmerAddress.toLowerCase() === contractAddress.toLowerCase()) {
        throw new Error("Cannot use contract address as farmer address");
      }

      // Validate farmer address is not zero address
      if (farmerAddress.toLowerCase() === "0x0000000000000000000000000000000000000000") {
        throw new Error("Invalid farmer address: cannot be zero address");
      }

      try {
        setIsLoading(true);
        setMessage("Encrypting score...");

        // Encrypt score using FHEVM
        // The second parameter MUST be the current user's address (the one who signs the proof)
        const encryptedInput = fhevmInstance.createEncryptedInput(
          contractAddress as `0x${string}`,
          address as `0x${string}`
        );
        encryptedInput.add32(score);
        const encrypted = await encryptedInput.encrypt();
        console.log("[useCropGrowthScore] Encryption details:", {
          contractAddress,
          farmerAddress,
          submitterAddress: address,
          score,
        });
        console.log("[useCropGrowthScore] Encryption complete", {
          hasHandles: !!encrypted.handles && encrypted.handles.length > 0,
          hasInputProof: !!encrypted.inputProof && encrypted.inputProof.length > 0,
        });

        setMessage("Submitting to blockchain...");

        // Check if Hardhat node is running (for local network)
        if (chainId === 31337) {
          try {
            const blockNumber = await ethersProvider.getBlockNumber();
            console.log("[useCropGrowthScore] Connected to Hardhat node, current block:", blockNumber);
          } catch (nodeError: any) {
            const errorMsg = nodeError?.message || String(nodeError);
            if (errorMsg.includes("Failed to fetch") || errorMsg.includes("ECONNREFUSED") || errorMsg.includes("timeout")) {
              throw new Error(
                "Cannot connect to Hardhat node. Please start Hardhat node first:\n" +
                "1. Open a terminal\n" +
                "2. Run: npx hardhat node\n" +
                "3. Wait for the node to start\n" +
                "4. Refresh this page"
              );
            }
            throw nodeError;
          }
        }

        // Verify contract is deployed
        const contractCode = await ethersProvider.getCode(contractAddress);
        if (contractCode === "0x" || contractCode.length <= 2) {
          throw new Error(
            `Contract not deployed at ${contractAddress}. Please deploy the contract first:\n` +
            "1. Make sure Hardhat node is running (npx hardhat node)\n" +
            "2. Deploy contract: npx hardhat deploy --network localhost\n" +
            "3. Update VITE_CONTRACT_ADDRESS in ui/.env file"
          );
        }

        const contract = new ethers.Contract(
          contractAddress,
          CropGrowthScoreABI,
          ethersSigner
        );

        const encryptedScoreHandle = encrypted.handles[0];
        if (!encryptedScoreHandle || !encrypted.inputProof || encrypted.inputProof.length === 0) {
          throw new Error("Encryption failed - missing handle or proof");
        }

        console.log("[useCropGrowthScore] Submitting transaction...");
        const tx = await contract.submitScore(
          farmerAddress,
          encryptedScoreHandle,
          encrypted.inputProof,
          {
            gasLimit: 5000000,
          }
        );
        console.log("[useCropGrowthScore] Transaction sent:", tx.hash);
        
        setMessage("Waiting for transaction confirmation...");
        const receipt = await tx.wait();
        console.log("[useCropGrowthScore] Transaction confirmed, block:", receipt.blockNumber);

        setMessage("Score submitted successfully! Refreshing entries...");
        
        // Wait a bit for the state to be fully updated and permissions to be set
        console.log("[useCropGrowthScore] Waiting for state update and permissions...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        console.error("[useCropGrowthScore] submitScore error:", error);
        
        let errorMessage = error?.message || String(error);
        
        // Check for contract execution errors
        if (error?.data?.message) {
          const contractError = error.data.message;
          if (contractError.includes("VM Exception") || contractError.includes("reverted")) {
            errorMessage = `Contract execution failed: ${contractError}. This may indicate:\n` +
              "1. FHE operation failed - check Hardhat node supports FHEVM\n" +
              "2. Input proof validation failed - try again\n" +
              "3. Contract needs to be redeployed - run 'npx hardhat deploy --network localhost'";
          }
        }
        
        // Provide more helpful error messages
        if (error?.code === "UNKNOWN_ERROR" || error?.code === -32603) {
          if (error?.data?.message) {
            // Contract error takes precedence
            // errorMessage already set above
          } else if (chainId === 31337) {
            errorMessage = "Cannot connect to Hardhat node. Please ensure 'npx hardhat node' is running on http://localhost:8545 with FHEVM support.";
          } else {
            errorMessage = `Network error: ${error.message || "Failed to connect to blockchain. Please check your network connection."}`;
          }
        } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("fetch")) {
          if (chainId === 31337) {
            errorMessage = "Cannot connect to Hardhat node. Please ensure 'npx hardhat node' is running on http://localhost:8545";
          } else {
            errorMessage = "Network connection failed. Please check your internet connection and try again.";
          }
        } else if (errorMessage.includes("Internal JSON-RPC error")) {
          if (chainId === 31337) {
            errorMessage = "Hardhat node error. Please ensure the Hardhat node is running with FHEVM support. Try restarting 'npx hardhat node'";
          } else {
            errorMessage = "Blockchain node error. Please try again or check if the network is operational.";
          }
        }
        
        setMessage(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      contractAddress,
      fhevmInstance,
      address,
      ethersProvider,
      ethersSigner,
      chainId,
    ]
  );

  const decryptScore = useCallback(
    async (entryId: number) => {
      if (!contractAddress) {
        throw new Error("Contract address not set");
      }

      if (!fhevmInstance) {
        throw new Error("FHEVM instance not available");
      }

      if (!address) {
        throw new Error("Wallet address not available");
      }

      if (!ethersProvider) {
        throw new Error("Ethers provider not available");
      }

      try {
        setIsLoading(true);
        setMessage("Fetching encrypted score...");

        const contract = new ethers.Contract(
          contractAddress,
          CropGrowthScoreABI,
          ethersProvider
        );

        const [encryptedScore, timestamp, farmerAddress] =
          await contract.getScoreEntry(entryId);

        if (farmerAddress.toLowerCase() !== address.toLowerCase()) {
          throw new Error("You can only decrypt your own scores");
        }

        setMessage("Decrypting score...");

        // Prepare handle-contract pairs
        const handle = typeof encryptedScore === "string" 
          ? encryptedScore 
          : ethers.hexlify(encryptedScore);
        
        const handleContractPairs = [
          { handle, contractAddress: contractAddress as `0x${string}` },
        ];

        // Generate keypair for EIP712 signature
        let keypair: { publicKey: Uint8Array; privateKey: Uint8Array };
        if (typeof (fhevmInstance as any).generateKeypair === "function") {
          keypair = (fhevmInstance as any).generateKeypair();
        } else {
          throw new Error("FHEVM instance does not support keypair generation");
        }

        // Create EIP712 signature for decryption
        const contractAddresses = [contractAddress as `0x${string}`];
        const startTimestamp = Math.floor(Date.now() / 1000).toString();
        const durationDays = "10";

        let eip712: any;
        if (typeof (fhevmInstance as any).createEIP712 === "function") {
          eip712 = (fhevmInstance as any).createEIP712(
            keypair.publicKey,
            contractAddresses,
            startTimestamp,
            durationDays
          );
        } else {
          eip712 = {
            domain: {
              name: "FHEVM",
              version: "1",
              chainId: chainId,
              verifyingContract: contractAddresses[0],
            },
            types: {
              UserDecryptRequestVerification: [
                { name: "publicKey", type: "bytes" },
                { name: "contractAddresses", type: "address[]" },
                { name: "startTimestamp", type: "string" },
                { name: "durationDays", type: "string" },
              ],
            },
            message: {
              publicKey: ethers.hexlify(keypair.publicKey),
              contractAddresses,
              startTimestamp,
              durationDays,
            },
          };
        }

        // Sign the EIP712 message
        const signature = await ethersSigner.signTypedData(
          eip712.domain,
          { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
          eip712.message
        );

        // For local mock network, signature may need to have "0x" prefix removed
        const signatureForDecrypt = chainId === 31337 
          ? signature.replace("0x", "") 
          : signature;

        // Decrypt using userDecrypt method
        const decryptedResult = await (fhevmInstance as any).userDecrypt(
          handleContractPairs,
          keypair.privateKey,
          keypair.publicKey,
          signatureForDecrypt,
          contractAddresses,
          address as `0x${string}`,
          startTimestamp,
          durationDays
        );

        const decryptedScore = Number(decryptedResult[handle] || 0);

        // Update entry with decrypted score
        setEntries((prev) =>
          prev.map((entry) =>
            entry.entryId === entryId
              ? { ...entry, decryptedScore: Number(decryptedScore) }
              : entry
          )
        );

        setMessage("Score decrypted successfully!");
      } catch (error: any) {
        const errorMessage = error?.message || String(error);
        setMessage(`Error: ${errorMessage}`);
        console.error("[useCropGrowthScore] decryptScore error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contractAddress, fhevmInstance, address, ethersProvider, ethersSigner, chainId]
  );

  const loadEntries = useCallback(async () => {
    if (!contractAddress || !address || !ethersProvider) {
      return;
    }

    try {
      setIsLoading(true);
      const contract = new ethers.Contract(
        contractAddress,
        CropGrowthScoreABI,
        ethersProvider
      );

      const hasEntriesResult = await contract.hasEntries(address);
      if (!hasEntriesResult) {
        setEntries([]);
        return;
      }

      const entryIds = await contract.getFarmerEntries(address);
      const entryPromises = entryIds.map(async (entryId: bigint) => {
        const [encryptedScore, timestamp] = await contract.getScoreEntry(
          entryId
        );
        return {
          entryId: Number(entryId),
          timestamp: Number(timestamp),
          encryptedScore: encryptedScore,
        };
      });

      const loadedEntries = await Promise.all(entryPromises);
      setEntries(loadedEntries.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error: any) {
      console.error("[useCropGrowthScore] loadEntries error:", error);
      setMessage(`Error loading entries: ${error?.message || String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, address, ethersProvider]);

  useEffect(() => {
    if (isConnected && contractAddress && address && ethersProvider) {
      loadEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, contractAddress, address, ethersProvider]);

  return {
    contractAddress,
    entries,
    isLoading,
    message,
    submitScore,
    decryptScore,
    loadEntries,
  };
}

