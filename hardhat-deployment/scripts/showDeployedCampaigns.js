// Load Hardhat environment
const hre = require("hardhat");
const campaignCreatorArtifact = require("../artifacts/contracts/CampaignCreator.sol/CampaignCreator.json"); // Import the contract ABI

async function main() {
  // Replace this with your contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get the contract instance
  const CampaignCreator = await hre.ethers.getContractFactory(
    "CampaignCreator",
    campaignCreatorArtifact.abi
  );
  const campaignCreator = await CampaignCreator.attach(contractAddress);

  // Get the deployed campaigns
  const deployedCampaigns = await campaignCreator.getDeployedCampaigns();

  console.log("Deployed Campaigns:", deployedCampaigns);
}

// Run the function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
