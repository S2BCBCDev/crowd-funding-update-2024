const { ethers } = require("hardhat");

// Function to generate a random string for description
function generateRandomDescription() {
  const adjectives = [
    "Awesome",
    "Fantastic",
    "Incredible",
    "Amazing",
    "Superb",
    "Excellent",
    "Wonderful",
  ];
  const nouns = [
    "Project",
    "Campaign",
    "Initiative",
    "Venture",
    "Endeavor",
    "Undertaking",
    "Mission",
  ];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}

// Function to generate a random minimum contribution amount
function generateRandomMinContribution() {
  return Math.floor(Math.random() * (5000 - 500 + 1)) + 500; // Random amount between 500 and 5000
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying CampaignCreator...");
  const CampaignCreator = await ethers.getContractFactory("CampaignCreator");
  const campaignCreator = await CampaignCreator.deploy();

  console.log("Deployer Address:", deployer.address);
  console.log("CampaignCreator Contract Address:", campaignCreator.target);

  // Loop to create multiple campaigns
  for (let i = 0; i < 3; i++) {
    // Generate random description and minimum contribution amount
    const description = generateRandomDescription();
    const minContribution = generateRandomMinContribution();

    // Create a campaign with random parameters
    await campaignCreator.createCampaign(minContribution, description);
  }

  // Retrieve the list of deployed campaigns
  const deployedCampaigns = await campaignCreator.getDeployedCampaigns();

  // Log the addresses of the deployed campaigns
  console.log("Deployed Campaign Addresses:", deployedCampaigns);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
