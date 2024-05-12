"use client";
import React, { useEffect, useState } from "react";
import Web3 from "web3"; // Import web3 library
import styles from "./page.module.css";
import Image from "next/image";
import campaignCreatorArtifact from "../../../hardhat-deployment/artifacts/contracts/CampaignCreator.sol/CampaignCreator.json"; // Import the JSON file
import crowdCollabArtifact from "../../../hardhat-deployment/artifacts/contracts/CrowdCollab.sol/CrowdCollab.json";
import CampaignInteraction from "./CampaignInteraction";

const contractCollabAbi = crowdCollabArtifact.abi;

export default function InteractContract() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaignCount, setCampaignCount] = useState(0);
  const [deployedCampaigns, setDeployedCampaigns] = useState([]);

  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [description, setDescription] = useState("");
  const [minContribution, setMinContribution] = useState("");

  const [campaignDescriptions, setCampaignDescriptions] = useState({});

  const [selectedCampaign, setSelectedCampaign] = useState(""); // State to hold selected campaign address

  useEffect(() => {
    const initializeWeb3 = async () => {
      const provider = new Web3.providers.HttpProvider("http://localhost:8545"); // Manually set up the provider
      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      // Initialize your contract
      const contractAddress = "0x4ed7c70f96b99c776995fb64377f0d4ab3b0e1c1"; // Replace with your contract address
      const contractABI = campaignCreatorArtifact.abi; // Replace with your contract ABI
      const contractInstance = new web3Instance.eth.Contract(
        contractABI,
        contractAddress
      );
      setContract(contractInstance);

      // Check if MetaMask is connected
      if (web3Instance.currentProvider.isMetaMask) {
        const accounts = await web3Instance.eth.getAccounts();
        setUserAddress(accounts[0]); // Assuming the first account is the user's address
        setIsConnected(true);
      }
      console.log(isConnected);
    };

    initializeWeb3();
  }, []);

  const getCampaignCount = async () => {
    if (!contract) return;

    try {
      const count = await contract.methods.getDeployedCampaigns().call();
      setCampaignCount(count.length);
      console.log(campaignCount);
    } catch (error) {
      console.error("Error fetching campaign count:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      getCampaignCount();
      getDeployedCampaigns();
    }
  }, [contract]);

  const createCampaign = async () => {
    if (!contract) return;

    try {
      await contract.methods
        .createCampaign(parseInt(minContribution), description)
        .send({ from: userAddress });
      console.log("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
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
      // connectMetaMask();
      const deployedCampaigns = await contract.methods
        .getDeployedCampaigns()
        .call();
      console.log("Deployed Campaigns:", deployedCampaigns);
      setDeployedCampaigns(deployedCampaigns);
    } catch (error) {
      console.error("Error fetching deployed campaigns:", error);
    }
  };

  // Handle click on a campaign address
  const handleCampaignClick = (campaignAddress) => {
    setSelectedCampaign(campaignAddress);
  };

  // Utility function to truncate Ethereum addresses
  const truncateAddress = (address) => {
    const start = address.substring(0, 7);
    const end = address.substring(address.length - 4, address.length);
    return `${start}...${end}`;
  };

  useEffect(() => {
    const fetchCampaignDescriptions = async () => {
      const descriptions = {};
      try {
        console.log("Fetching campaign descriptions...");
        if (contract && deployedCampaigns.length > 0) {
          const web3 = new Web3("http://127.0.0.1:8545");
          for (const campaign of deployedCampaigns) {
            const instance = new web3.eth.Contract(contractCollabAbi, campaign);
            const description = await instance.methods
              .campaignDescription()
              .call();
            descriptions[campaign] = description;
          }
          setCampaignDescriptions(descriptions);
        }
      } catch (error) {
        console.error("Error fetching campaign descriptions:", error);
      }
    };

    fetchCampaignDescriptions();
  }, [contract, deployedCampaigns]);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Initialize your contract
        const contractAddress = "0x4ed7c70f96b99c776995fb64377f0d4ab3b0e1c1"; // Replace with your contract address
        const contractABI = campaignCreatorArtifact.abi; // Replace with your contract ABI
        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setWeb3(web3Instance);
        setContract(contractInstance);
        setIsConnected(true);
        const accounts = await web3Instance.eth.getAccounts();
        setUserAddress(accounts[0]);
        console.log("Connected to MetaMask!", accounts[0]);
      } catch (error) {
        console.error(
          "User denied account access or an error occurred:",
          error
        );
      }
    } else {
      console.log("MetaMask not found. Please install MetaMask to connect.");
    }
  };

  // Add this function to handle the connection
  const handleConnectButtonClick = () => {
    connectMetaMask();
    setIsConnected(true); // Update isConnected state when connected
  };

  return (
    <main className={styles.main}>
      <div className={styles.card} onClick={() => window.location.reload()}>
        <Image
          src="s2bc/s2bc-logo.svg"
          width={96}
          height={96}
          alt="Description of the image"
          style={{ textAlign: "center", cursor: "pointer" }} // Add cursor pointer for indicating it's clickable
        />
      </div>

      <button className={styles.card} onClick={handleConnectButtonClick}>
        {!isConnected ? (
          <>
            <h2>Connect MetaMask</h2>
            <p>Click here to connect your MetaMask wallet</p>
          </>
        ) : (
          <>
            <h2>Connected to MetaMask!</h2>
            <p>Account:</p>
            <p style={{ wordBreak: "break-all" }}>{userAddress}</p>
          </>
        )}
      </button>

      <div className={styles.grid}>
        <div className={styles.card} onClick={getCampaignCount}>
          <p style={{ textAlign: "center" }}>
            Total Campaign Count: {campaignCount}
          </p>
        </div>

        <button className={styles.card} onClick={getDeployedCampaigns}>
          <h2>
            Get Deployed Campaigns <span>-&gt;</span>
          </h2>
          <p>Get all deployed campaigns</p>
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
      </div>

      {/* Display deployed campaigns */}
      <div className={styles.card}>
        <div className={styles.grid}>
          {deployedCampaigns.map((campaign, index) => (
            <div
              className={styles.card}
              key={index}
              onClick={() => handleCampaignClick(campaign)} // not used, find alternative to this
            >
              <h2>{campaignDescriptions[campaign]}</h2>

              <hr />

              <h4>id: {index + 0}</h4>
              <h3>{truncateAddress(campaign)}</h3>

              <hr />

              <p style={{ wordBreak: "break-all" }}>
                Instance address: {campaign}
              </p>
              <CampaignInteraction
                contractAddress={campaign}
                isConnected={isConnected}
                userAddress={userAddress}
                web3={web3}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}