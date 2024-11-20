# Secure Harvest Vault

A blockchain-based application for securely storing encrypted crop growth scores using Fully Homomorphic Encryption (FHE). Agricultural technicians can submit encrypted scores (0-10) for farmers, and only the farmers can decrypt their own scores.

## 🔗 Live Demo & Video

- **🌐 Live Demo**: [https://secure-harvest-vault.vercel.app/](https://secure-harvest-vault.vercel.app/)
- **🎥 Demo Video**: [View on GitHub](https://github.com/JuneWat/secure-harvest-vault/blob/main/secure-harvest-vault.mp4)

## ✨ Features

- **🔐 Fully Homomorphic Encryption (FHE)**: All scores are encrypted before being stored on the blockchain
- **🛡️ Privacy-First**: Only farmers can decrypt their own scores
- **⛓️ Blockchain Storage**: Immutable and decentralized data storage
- **🌈 Rainbow Wallet Integration**: Easy wallet connection using RainbowKit
- **🔒 End-to-End Encryption**: Complete data protection from submission to decryption
- **⚡ Real-time Encryption**: Scores are encrypted client-side before blockchain submission

## Project Structure

```
secure-harvest-vault/
├── contracts/              # Smart contracts
│   ├── CropGrowthScore.sol # Main contract for encrypted score storage
│   └── FHECounter.sol      # Example FHE counter contract
├── deploy/                 # Deployment scripts
├── test/                   # Test files
│   ├── CropGrowthScore.ts # Local network tests
│   └── CropGrowthScoreSepolia.ts # Sepolia testnet tests
├── ui/                     # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── fhevm/         # FHEVM integration
│   │   └── pages/         # Page components
│   └── public/            # Static assets
└── types/                 # TypeScript types (generated)
```

## Prerequisites

- Node.js >= 20
- npm >= 7.0.0
- Hardhat node with FHEVM support (for local development)

## Setup

### 1. Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd ui
npm install
```

### 2. Configure Environment Variables

For contract deployment:
```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set ETHERSCAN_API_KEY  # Optional
```

For frontend:
Create `ui/.env` file:
```
VITE_CONTRACT_ADDRESS=0x...  # Set after contract deployment
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy Contracts

**Local Network:**
```bash
# Start Hardhat node with FHEVM support
npx hardhat node

# In another terminal, deploy contracts
npx hardhat deploy --network localhost
```

**Sepolia Testnet:**
```bash
npx hardhat deploy --network sepolia
```

After deployment, update `ui/.env` with the contract address from `deployments/localhost/CropGrowthScore.json` or `deployments/sepolia/CropGrowthScore.json`.

### 5. Run Tests

**Local Network:**
```bash
npm run test
```

**Sepolia Testnet:**
```bash
npm run test:sepolia
```

### 6. Start Frontend

```bash
cd ui
npm run dev
```

The application will be available at `http://localhost:8080`.

## Usage

### For Agricultural Technicians

1. Connect your wallet using Rainbow Wallet
2. Enter the farmer's address
3. Enter a crop growth score (0-10)
4. Click "Submit Encrypted Score"
5. The score will be encrypted and stored on the blockchain

### For Farmers

1. Connect your wallet using Rainbow Wallet
2. View your encrypted scores in the list
3. Click "Decrypt Score" to decrypt and view your score
4. Only you can decrypt scores assigned to your address

## 📋 Smart Contract Overview

The `CropGrowthScore` contract is built on FHEVM (Fully Homomorphic Encryption Virtual Machine) and provides secure storage and retrieval of encrypted crop growth scores.

### 🔧 Core Contract Functions

#### `submitScore(address farmerAddress, externalEuint32 encryptedScore, bytes calldata inputProof) external`
**Purpose**: Submit an encrypted crop growth score for a farmer
- **Parameters**:
  - `farmerAddress`: The Ethereum address of the farmer who owns the crop
  - `encryptedScore`: The encrypted score value (0-10) using FHE
  - `inputProof`: FHE input proof for verification
- **Access Control**: Anyone can call this function
- **Permissions**: Grants decryption permissions to the farmer address only
- **Events**: Emits `ScoreSubmitted` event

#### `getScoreEntry(uint256 entryId) external view returns (euint32 encryptedScore, uint256 timestamp, address farmerAddress)`
**Purpose**: Retrieve encrypted score entry details
- **Parameters**: `entryId` - The unique identifier of the score entry
- **Returns**: Encrypted score, submission timestamp, and farmer address
- **Access Control**: Public view function

#### `getFarmerEntries(address farmerAddress) external view returns (uint256[] memory)`
**Purpose**: Get all entry IDs for a specific farmer
- **Parameters**: `farmerAddress` - The farmer's Ethereum address
- **Returns**: Array of entry IDs belonging to the farmer
- **Access Control**: Public view function

#### `hasEntries(address farmerAddress) external view returns (bool)`
**Purpose**: Check if a farmer has any stored entries
- **Parameters**: `farmerAddress` - The farmer's Ethereum address
- **Returns**: Boolean indicating whether entries exist
- **Access Control**: Public view function

#### `getTotalEntries() external view returns (uint256)`
**Purpose**: Get the total number of entries stored in the contract
- **Returns**: Total count of all score entries
- **Access Control**: Public view function

## Testing

The project includes comprehensive tests:

- **CropGrowthScore.ts**: Tests for local network (mock FHEVM)
- **CropGrowthScoreSepolia.ts**: Tests for Sepolia testnet

Test coverage includes:
- Score submission
- Score retrieval
- Score decryption
- Multiple scores per farmer
- Access control validation

## Development

### Contract Development

```bash
# Compile contracts
npm run compile

# Run linter
npm run lint

# Format code
npm run prettier:write
```

### Frontend Development

```bash
cd ui

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture & Cryptography

### 🔐 Encryption Flow (Score Submission)

The encryption process ensures scores are protected before blockchain storage:

1. **Input Validation**: Technician enters score (0-10) with farmer address
2. **FHEVM Instance Creation**: Frontend initializes FHEVM instance with contract address
3. **Encrypted Input Creation**:
   ```typescript
   const encryptedInput = fhevmInstance.createEncryptedInput(
     contractAddress,
     farmerAddress  // Farmer gets decryption permission
   );
   encryptedInput.add32(score);
   ```
4. **Encryption Execution**: Generate encrypted handles and input proofs
5. **Blockchain Submission**:
   ```typescript
   contract.submitScore(farmerAddress, encryptedHandle, inputProof)
   ```
6. **Permission Granting**: Contract grants decryption permissions to farmer address using `FHE.allow()`

### 🔓 Decryption Flow (Score Retrieval)

The decryption process requires cryptographic proof of ownership:

1. **Access Check**: Farmer requests decryption of their score entry
2. **Encrypted Data Fetch**: Retrieve encrypted score from contract
3. **Keypair Generation**: FHEVM generates new public/private keypair for decryption
4. **EIP712 Signature Creation**:
   ```typescript
   const eip712 = createEIP712(publicKey, contractAddresses, timestamp, duration);
   const signature = await signer.signTypedData(eip712.domain, eip712.types, eip712.message);
   ```
5. **Permission Verification**: Blockchain verifies farmer's ownership via signature
6. **Homomorphic Decryption**: FHEVM decrypts score using private key and signature
7. **Result Display**: Decrypted score shown to farmer (plaintext never stored on-chain)
6. Decrypted score is displayed to the farmer

## 🔒 FHE Technical Implementation

### Fully Homomorphic Encryption Details

**FHEVM (Zama)** enables computation on encrypted data without decryption:

- **Encryption Algorithm**: TFHE (Fast Fully Homomorphic Encryption)
- **Key Management**: Ephemeral keys generated per decryption session
- **Permission Model**: Granular access control via `FHE.allow()` function
- **Zero-Knowledge Proofs**: Input proofs ensure valid encrypted computations

### Data Structures

```solidity
struct ScoreEntry {
    euint32 encryptedScore;  // FHE-encrypted 32-bit integer
    uint256 timestamp;       // Submission timestamp
    address farmerAddress;   // Authorized decryptor
}
```

### Cryptographic Operations

**Encryption (Frontend)**:
```typescript
// Create encrypted input with farmer's decryption permission
const encryptedInput = fhevm.createEncryptedInput(contractAddr, farmerAddr);
encryptedInput.add32(scoreValue);  // Add score to encrypted input
const { handles, inputProof } = await encryptedInput.encrypt();
```

**Storage (Contract)**:
```solidity
// Store encrypted score and grant permissions
_scoreEntries[entryId] = ScoreEntry(encryptedScore, block.timestamp, farmerAddress);
FHE.allowThis(encryptedScore);    // Contract permission
FHE.allow(encryptedScore, farmerAddress);  // Farmer permission
```

**Decryption (Frontend)**:
```typescript
// Generate keypair and EIP712 signature for authorization
const keypair = fhevm.generateKeypair();
const signature = await signer.signTypedData(eip712Domain, eip712Types, eip712Message);
const decryptedScore = await fhevm.userDecrypt(handles, privateKey, publicKey, signature);
```

## 🛡️ Security Considerations

- **🔐 End-to-End Encryption**: Scores encrypted client-side before transmission
- **👤 Access Control**: Only farmers can decrypt their own scores via cryptographic proof
- **✅ Input Validation**: Contract validates addresses and permissions
- **📝 EIP712 Signatures**: Required for all decryption operations
- **🚫 No Plaintext Storage**: Encrypted data only; plaintext never persisted on-chain
- **🔑 Ephemeral Keys**: Fresh keypairs generated for each decryption session
- **⛓️ Immutable Audit Trail**: All operations recorded on blockchain

## License

BSD-3-Clause-Clear

## Git Push to GitHub

This project includes automated scripts to easily push your changes to GitHub after each modification.

### Quick Push (Recommended)

#### Windows (PowerShell)
```powershell
# Push with auto-generated commit message (includes timestamp)
.\push-to-github.ps1

# Push with custom commit message
.\push-to-github.ps1 "Your commit message here"

# Force push (use with caution)
.\push-to-github.ps1 -Force "Force update message"
```

#### Linux/Mac (Bash)
```bash
# Push with auto-generated commit message (includes timestamp)
./push-to-github.sh

# Push with custom commit message
./push-to-github.sh "Your commit message here"

# Force push (use with caution)
./push-to-github.sh --force "Force update message"
```

### Manual Push (Alternative)

If you prefer manual control:

```bash
# Check status
git status

# Add all changes
git add -A

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push origin master:main
```

### What the Scripts Do

1. **Check for Changes**: Automatically detects if there are any modifications
2. **Add Files**: Stages all changed files for commit
3. **Commit**: Creates a commit with your message (or auto-generates one)
4. **Push**: Uploads changes to GitHub main branch
5. **Verify**: Shows the latest commit for confirmation

### Troubleshooting

- **No changes detected**: The script will inform you if there's nothing to commit
- **Push failed**: Check your internet connection and GitHub permissions
- **Permission denied**: Ensure you have push access to the repository

## Support

For issues and questions:
- Check the [FHEVM Documentation](https://docs.zama.ai/fhevm)
- Visit [Zama Discord](https://discord.gg/zama)
