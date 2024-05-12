const { expect } = require("chai");
require("@nomicfoundation/hardhat-toolbox");
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

describe("CampaignCreator", function () {
  let CampaignCreator;
  let campaignCreator;
  let deployer;

  beforeEach(async () => {
    console.log(
      "Before each hook executing... DEPLOY CampaignCreator smart contract:",
      "\n"
    );
    [deployer] = await ethers.getSigners();

    CampaignCreator = await ethers.getContractFactory("CampaignCreator");
    campaignCreator = await CampaignCreator.deploy();

    console.log("Deployer Address:", deployer.address, "\n");
    console.log(
      "CampaignCreator Contract Address:",
      campaignCreator.address,
      "\n",
      "CampaignCreator Contract Address:",
      campaignCreator.address,
      "\n"
    );
  });

  it("should create multiple campaigns with random parameters and check if they have been deployed successfully", async function () {
    // Loop to create multiple campaigns
    for (let i = 0; i < 100; i++) {
      // Generate random description and minimum contribution amount
      const description = generateRandomDescription();
      const minContribution = generateRandomMinContribution();

      // Create a campaign with random parameters
      await campaignCreator.createCampaign(minContribution, description);
    }

    // Retrieve the list of deployed campaigns
    const deployedCampaigns = await campaignCreator.getDeployedCampaigns();

    // Expect the length of deployedCampaigns array to be 10
    expect(deployedCampaigns.length).to.equal(100);

    // Log the addresses of the deployed campaigns
    console.log("Deployed Campaign Addresses:", deployedCampaigns);
  });

  // Add more test cases as needed
});
