const { expect } = require("chai");
require("@nomicfoundation/hardhat-toolbox");
const { ethers } = require("hardhat");

describe("CampaignCreator", function () {
    let CampaignCreator;
    let campaignCreator;
    let deployer; // Declare deployer variable outside beforeEach to make it accessible to other test cases

    beforeEach(async () => {
        console.log("Before each hook executing... DEPLOY CampaignCreator smart contract:", "\n");
        [deployer] = await ethers.getSigners();
    
        CampaignCreator = await ethers.getContractFactory("CampaignCreator");
        campaignCreator = await CampaignCreator.deploy();

        // console.log(`json output: ${campaignCreator}`);
        // console.log("CampaignCreator object:");
       // console.dir(campaignCreator);

        // Extract runner address
        const Runner = campaignCreator.runner.address;
        console.log("Runner/Sender/Deployer Address:", Runner, "\n");

    // Extract target property
    const target = campaignCreator.target;
    console.log("Contract Target address:", target, "\n");

    });


    it("The contract got just deployed so it should return an empty list of deployed campaigns initially", async function () {
        const deployedCampaigns = await campaignCreator.getDeployedCampaigns();
        expect(deployedCampaigns).to.be.an('array').that.is.empty;
    });

    it("should create a new campaign with specified parameters and then check if a campaign exists in the array of the contract", async function () {
        const minContribution = 1000;
        const description = "Test Campaign";
    
        await campaignCreator.createCampaign(minContribution, description);
    
        const deployedCampaigns = await campaignCreator.getDeployedCampaigns();
        expect(deployedCampaigns.length).to.equal(1);
        
    
        // Add more assertions to verify the properties of the newly created campaign
    
        // Get the address of the last deployed campaign
        const lastDeployedCampaignAddress = deployedCampaigns[deployedCampaigns.length - 1];
    
        // Log the address of the last deployed campaign
        console.log("Last deployed campaign address:", lastDeployedCampaignAddress);
    });
    

    // Add more test cases as needed
});
