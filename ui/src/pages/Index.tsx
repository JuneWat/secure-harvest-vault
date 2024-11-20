import { useState } from "react";
import Logo from "@/components/Logo";
import WalletConnect from "@/components/WalletConnect";
import ScoreSubmission from "@/components/ScoreSubmission";
import ScoreList from "@/components/ScoreList";
import { useAccount, useChainId } from "wagmi";
import { useCropGrowthScore } from "@/hooks/useCropGrowthScore";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Contract address - should be set after deployment
// For local development, use the address from deployments/localhost/CropGrowthScore.json
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

const Index = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const [decryptingId, setDecryptingId] = useState<number | undefined>(undefined);

  const {
    entries,
    isLoading,
    message,
    submitScore,
    decryptScore,
    loadEntries,
  } = useCropGrowthScore(CONTRACT_ADDRESS || undefined);

  const handleSubmit = async (farmerAddress: string, score: number) => {
    await submitScore(farmerAddress, score);
    // Reload entries after submission
    setTimeout(() => {
      loadEntries();
    }, 2000);
  };

  const handleDecrypt = async (entryId: number) => {
    try {
      setDecryptingId(entryId);
      await decryptScore(entryId);
      toast({
        title: "Score Decrypted Successfully!",
        description: "The encrypted score has been decrypted.",
      });
    } catch (error: any) {
      toast({
        title: "Decryption Failed",
        description: error?.message || "Failed to decrypt score.",
        variant: "destructive",
      });
    } finally {
      setDecryptingId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <WalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pt-24">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet to Continue</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Connect your Rainbow Wallet to access encrypted crop growth score storage and management features.
            </p>
          </div>
        ) : !CONTRACT_ADDRESS ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Contract Not Deployed</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Please deploy the CropGrowthScore contract first. Set VITE_CONTRACT_ADDRESS in your .env file.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Network Warning */}
            {chainId === 31337 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Local Network Detected</AlertTitle>
                <AlertDescription>
                  Make sure Hardhat node is running with FHEVM support. Run: <code className="text-xs bg-muted px-1 py-0.5 rounded">npx hardhat node</code>
                </AlertDescription>
              </Alert>
            )}

            {/* Score Submission */}
            <ScoreSubmission
              contractAddress={CONTRACT_ADDRESS}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {/* Score List */}
            <ScoreList
              entries={entries}
              isLoading={isLoading}
              onDecrypt={handleDecrypt}
              decryptingId={decryptingId}
            />

            {/* Status Message */}
            {message && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
