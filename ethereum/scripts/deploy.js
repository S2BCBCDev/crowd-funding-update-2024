// Import the ethers library to use with Hardhat deployments
const { ethers } = require("hardhat");

// Deploy Migrations contract
async function deployMigrations() {
  const Migrations = await ethers.getContractFactory("Migrations");
  console.log("Deploying Migrations...");
  const migrations = await Migrations.deploy();
  await migrations.deployed();
  console.log("Migrations deployed to:", migrations.address);
}

// Deploy CampaignCreator contract (assuming CampaignCreator contract is defined in a file CampaignCreator.sol)
async function deployCampaignCreator() {
  const CampaignCreator = await ethers.getContractFactory("CampaignCreator");
  console.log("Deploying CampaignCreator...");
  const campaignCreator = await CampaignCreator.deploy();
  await campaignCreator.deployed();
  console.log("CampaignCreator deployed to:", campaignCreator.address);
}

// Execute deployment
async function main() {
  await deployMigrations();
  await deployCampaignCreator();
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
