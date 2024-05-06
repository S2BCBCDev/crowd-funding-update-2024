'use client'
import React, { useEffect, useState } from 'react';
import Web3 from 'web3'; // Import web3 library
import styles from "./page.module.css";
import campaignCreatorArtifact from "../../../hardhat-deployment/artifacts/contracts/CampaignCreator.sol/CampaignCreator.json"; // Import the JSON file

// console.log(campaignCreatorArtifact.abi);

export default function InteractContract() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaignCount, setCampaignCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [description, setDescription] = useState('');
  const [minContribution, setMinContribution] = useState('');


  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        // Modern dapp browsers
        const web3Instance = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);

          // Initialize your contract
          const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Replace with your contract address
          const contractABI = campaignCreatorArtifact.abi; // Replace with your contract ABI
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);

          // Set isConnected to true if MetaMask is connected
          setIsConnected(true);

          // Get the connected user's address
          const accounts = await web3Instance.eth.getAccounts();
          setUserAddress(accounts[0]); // Assuming the first account is the user's address
        } catch (error) {
          console.error('User denied account access or an error occurred:', error);
        }
      } else if (window.web3) {
        // Legacy dapp browsers
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);

        // Initialize your contract
        const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Replace with your contract address
        const contractABI = campaignCreatorArtifact.abi; // Replace with your contract ABI
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);

        // Set isConnected to true if MetaMask is connected
        setIsConnected(true);

        // Get the connected user's address
        const accounts = await web3Instance.eth.getAccounts();
        setUserAddress(accounts[0]); // Assuming the first account is the user's address
      } else {
        // Non-dapp browsers
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    initializeWeb3();
  }, []);

  const getCampaignCount = async () => {
    if (!contract) return;

    try {
      const count = await contract.methods.getDeployedCampaigns().call();
      setCampaignCount(count.length);
    } catch (error) {
      console.error('Error fetching campaign count:', error);
    }
  };

  const createCampaign = async () => {
    if (!contract) return;

    try {
      await contract.methods.createCampaign(
        parseInt(minContribution), 
        description
      ).send({ from: userAddress });
      console.log("Campaign created successfully!");
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleMinContributionChange = (event) => {
    setMinContribution(event.target.value);
  };

  // New function to interact with the contract
  const getDeployedCampaigns = async () => {
    if (!contract) return;

    try {
      const deployedCampaigns = await contract.methods.getDeployedCampaigns().call();
      console.log("Deployed Campaigns:", deployedCampaigns);
    } catch (error) {
      console.error('Error fetching deployed campaigns:', error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <button className={styles.card} onClick={getCampaignCount}>
          <h2>
            Get Campaign Count <span>-&gt;</span>
          </h2>
          <p>Current Campaign Count: {campaignCount}</p>
        </button>

        <div className={styles.card}>
          <h2>Create Campaign</h2>
          <input 
            type="text" 
            placeholder="Description" 
            value={description} 
            onChange={handleDescriptionChange} 
          />
          <input 
            type="number" 
            placeholder="Minimum Contribution" 
            value={minContribution} 
            onChange={handleMinContributionChange} 
          />
          <button onClick={createCampaign}>Create Campaign</button>
        </div>

        <button className={styles.card} onClick={getDeployedCampaigns}>
          <h2>
            Get Deployed Campaigns <span>-&gt;</span>
          </h2>
          <p>Get all deployed campaigns</p>
        </button>
      </div>
    </main>
  );
}