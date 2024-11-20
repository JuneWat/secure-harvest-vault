# Secure Harvest Vault

A blockchain-based application for securely storing encrypted crop growth scores using Fully Homomorphic Encryption (FHE). Agricultural technicians can submit encrypted scores (0-10) for farmers, and only the farmers can decrypt their own scores.

## Features

- **Fully Homomorphic Encryption (FHE)**: All scores are encrypted before being stored on the blockchain
- **Privacy-First**: Only farmers can decrypt their own scores
- **Blockchain Storage**: Immutable and decentralized data storage
- **Rainbow Wallet Integration**: Easy wallet connection using RainbowKit
- **End-to-End Encryption**: Complete data protection from submission to decryption

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

## Contract Functions

### `submitScore(address farmerAddress, bytes32 encryptedScore, bytes calldata inputProof)`
Submit an encrypted score for a farmer. Only the farmer can decrypt it.

### `getScoreEntry(uint256 entryId)`
Get score entry details including encrypted score, timestamp, and farmer address.

### `getFarmerEntries(address farmerAddress)`
Get all entry IDs for a specific farmer.

### `hasEntries(address farmerAddress)`
Check if a farmer has any entries.

### `getTotalEntries()`
Get the total number of entries in the contract.

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

## Architecture

### Encryption Flow

1. Technician enters score (0-10)
2. Frontend uses FHEVM to encrypt the score
3. Encrypted score is submitted to the contract
4. Contract stores encrypted score with permissions
5. Only the farmer can decrypt using their wallet

### Decryption Flow

1. Farmer requests decryption of a score
2. Frontend fetches encrypted score from contract
3. FHEVM generates decryption keypair
4. Farmer signs EIP712 message
5. FHEVM decrypts the score
6. Decrypted score is displayed to the farmer

## Security Considerations

- All scores are encrypted using FHE before blockchain storage
- Only farmers can decrypt their own scores
- Contract validates farmer addresses
- EIP712 signatures required for decryption
- No plaintext scores are ever stored on-chain

## License

BSD-3-Clause-Clear

## Support

For issues and questions:
- Check the [FHEVM Documentation](https://docs.zama.ai/fhevm)
- Visit [Zama Discord](https://discord.gg/zama)
