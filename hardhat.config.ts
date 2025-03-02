import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv'; // Explicitly import dotenv
dotenv.config(); // Load environment variables

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
  },
  networks: {
    'a8-testnet': {
      url: 'https://rpcv2-testnet.ancient8.gg/',
      accounts: process.env.WALLET_KEY ? [process.env.WALLET_KEY] : [], // Ensure a valid array
      gasPrice: 1000000000,
      chainId: 28122024, // Ancient 8 testnet chain ID
    },
  },
  defaultNetwork: 'a8-testnet',
};

export default config;