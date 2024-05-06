// Load Hardhat environment
const hre = require("hardhat");
const campaignCreatorArtifact = require("../artifacts/contracts/CampaignCreator.sol/CampaignCreator.json"); // Import the contract ABI

async function main() {
    // Replace this with your contract address
    const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

    // Get the contract instance
    const CampaignCreator = await hre.ethers.getContractFactory("CampaignCreator", campaignCreatorArtifact.abi);
    const campaignCreator = await CampaignCreator.attach(contractAddress);

    // Get the deployed campaigns
    const deployedCampaigns = await campaignCreator.getDeployedCampaigns();

    console.log("Deployed Campaigns:", deployedCampaigns);
}

// Run the function
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
