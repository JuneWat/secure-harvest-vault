import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// Localhost chain for development
const localhost = defineChain({
  id: 31337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
});

export const config = getDefaultConfig({
  appName: 'Secure Harvest Vault',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [localhost, sepolia, mainnet, polygon, optimism, arbitrum],
  ssr: false,
});
