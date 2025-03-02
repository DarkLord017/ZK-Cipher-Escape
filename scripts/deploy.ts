import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  // Debug: Print environment variables (remove this in production)
  console.log("WALLET_KEY exists:", !!process.env.WALLET_KEY);
  
  if (!process.env.WALLET_KEY) {
    throw new Error("WALLET_KEY not found in .env file");
  }

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  
  // Deploy Game contract
  const Game = await ethers.getContractFactory("Game");
  const game = await Game.deploy();
  await game.waitForDeployment();
  
  console.log('Game Contract Deployed at:', await game.getAddress());
  
  // Deploy GameGateway contract
  const GameGateway = await ethers.getContractFactory("GameGateway");
  const gameGateway = await GameGateway.deploy();
  await gameGateway.waitForDeployment();
  
  console.log('GameGateway Contract Deployed at:', await gameGateway.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });