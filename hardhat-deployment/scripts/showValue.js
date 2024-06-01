// Load the ethers module
const { ethers } = require("hardhat");

async function main() {
  // Retrieve the deployed CampaignCreator contract instance
  const CampaignCreator = await ethers.getContractFactory("CampaignCreator");
  const campaignCreator = await CampaignCreator.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  // Call contract functions
  const result = await campaignCreator.createCampaign(1000000, "Campaign Name"); // Example function call

  // Interact with the result
  console.log("Transaction hash:", result.hash);
  console.log("Block number:", result.blockNumber);
  console.log("Campaign created:", result.events[0].args.name); // Assuming an event is emitted upon campaign creation
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
