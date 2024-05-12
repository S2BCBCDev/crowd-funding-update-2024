"use client";

import React, { useEffect, useState } from "react";
import Web3 from "web3";
import crowdCollabArtifact from "../../../hardhat-deployment/artifacts/contracts/CrowdCollab.sol/CrowdCollab.json";

const contractAbi = crowdCollabArtifact.abi;

const CampaignInteraction = ({ contractAddress }) => {
  const [contractInstance, setContractInstance] = useState(null);
  const [campaignDescription, setCampaignDescription] = useState("");
  const [manager, setManager] = useState("");
  const [minimumContribution, setMinimumContribution] = useState(0);
  const [minimumContributionShow, setMinimumContributionShow] = useState(0);

  const [numberSupporters, setNumberSupporters] = useState(0);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const web3 = new Web3("http://localhost:8545");
    const instance = new web3.eth.Contract(contractAbi, contractAddress);
    setContractInstance(instance);
  }, [contractAddress]);

  useEffect(() => {
    const getSummary = async () => {
      try {
        console.log("Fetching contract summary...");
        if (contractInstance) {
          const description = await contractInstance.methods
            .campaignDescription()
            .call();
          const managerAddress = await contractInstance.methods
            .manager()
            .call();
          const minimumContribution = await contractInstance.methods
            .minimumContribution()
            .call();
          const minimumContributionShow = minimumContribution.toString();

          const numSupporters = await contractInstance.methods
            .numberSupporters()
            .call();

          setCampaignDescription(description);
          setManager(managerAddress);
          setMinimumContribution(minimumContribution);

          setNumberSupporters(numSupporters);
          console.log(numSupporters);
        }
      } catch (error) {
        console.error("Error getting contract summary:", error);
      }
    };

    getSummary();
  }, [contractInstance]);

  return (
    <div>
      <h2>Campaign Interactions:</h2>
      <p>Description: {campaignDescription}</p>
      <p style={{ wordBreak: "break-all" }}>Manager: {manager}</p>
      <p style={{ wordBreak: "break-all" }}>
        Minimum Contribution: {minimumContribution.toString()}
      </p>
      <p>Number of Supporters: {numberSupporters.toString()}</p>
      {/* Render requests here */}
    </div>
  );
};

export default CampaignInteraction;
