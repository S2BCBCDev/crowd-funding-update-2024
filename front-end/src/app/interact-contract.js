"use client";

import dotenv from "dotenv";
dotenv.config();
console.log(process.env.RPC_URL);

import React, { useEffect, useState } from "react";
import Web3 from "web3"; // Import web3 library
import styles from "./page.module.css";
import Image from "next/image";
import campaignCreatorArtifact from "../../../hardhat-deployment/artifacts/contracts/CampaignCreator.sol/CampaignCreator.json"; // Import the JSON file
import crowdCollabArtifact from "../../../hardhat-deployment/artifacts/contracts/CrowdCollab.sol/CrowdCollab.json";
import CampaignInteraction from "./CampaignInteraction";

const contractCollabAbi = crowdCollabArtifact.abi;

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address Campaign Creator

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

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Initialize your contract
        //  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
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

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (window.ethereum) {
          await connectMetaMask();
        } else {
          console.log(
            "MetaMask not found. Please install MetaMask to connect."
          );
          setIsConnected(false);
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setUserAddress(accounts[0]); // Assuming the first account is the user's address
      setIsConnected(true);
      // getCampaignCount();
    };

    initializeWeb3();
  }, []);

  const getCampaignCount = async () => {
    if (!contract) return;

    try {
      const count = await contract.methods.getDeployedCampaigns().call();
      setCampaignCount(count.length);
      console.log("count", campaignCount);
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

    // Check if connected variable is not true, then call connectMetaMask()
    if (!isConnected) {
      connectMetaMask();
      return; // Stop execution until connection is established
    }

    try {
      await contract.methods
        .createCampaign(parseInt(minContribution), description)
        .send({ from: userAddress });
      console.log("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
    window.location.reload();
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
      try {
        if (!contract || deployedCampaigns.length === 0) return;

        const descriptions = {};

        await Promise.all(
          deployedCampaigns.map(async (campaign) => {
            const instance = new web3.eth.Contract(contractCollabAbi, campaign);
            const description = await instance.methods
              .campaignDescription()
              .call();
            descriptions[campaign] = description;
          })
        );

        setCampaignDescriptions(descriptions);
      } catch (error) {
        console.error("Error fetching campaign descriptions:", error);
      }
    };

    fetchCampaignDescriptions();
  }, [contract, deployedCampaigns]);

  const handleRefreshButtonClick = () => {
    getDeployedCampaigns();
    window.location.reload(); // Reload the page after fetching deployed campaigns
  };

  const minContributionETH = minContribution / 10 ** 18;

  return (
    <main className={styles.main}>
      {/* Logo */}
      <div className={styles.card} onClick={() => window.location.reload()}>
        <Image
          src="s2bc/s2bc-logo.svg"
          width={96}
          height={96}
          alt="Description of the image"
          style={{ textAlign: "center", cursor: "pointer" }} // Add cursor pointer for indicating it's clickable
        />
      </div>

      {/* MetaMask connection button */}
      <button className={styles.card} onClick={handleConnectButtonClick}>
        {!isConnected ? (
          <>
            <h2
              style={{
                background:
                  "rgba(var(--color-connect-button-not-connected), 100)",
                border: "1px solid rgba(var(--card-border-rgb), 100)",
                borderRadius: "12px",
              }}
            >
              Connect MetaMask
            </h2>
            <p>Click here to connect your MetaMask wallet</p>
          </>
        ) : (
          <>
            <h2
              style={{
                background: "rgba(var(--color-connect-button-connected), 100)",
                border: "1px solid rgba(var(--card-border-rgb), 100)",
                borderRadius: "12px",
              }}
            >
              Connected to MetaMask!
            </h2>
            <p>Account:</p>
            <p style={{ wordBreak: "break-all" }}>
              <strong>{userAddress}</strong>
            </p>
          </>
        )}
      </button>

      {/* Grid for campaign-related actions */}
      <div className={styles.grid}>
        {/* Get total campaign count */}
        <div className={styles.card} onClick={getCampaignCount}>
          <h4 style={{ textAlign: "center" }}>
            Total Campaign Count: <strong>{campaignCount}</strong>{" "}
            <span>&#x1F4B0;</span>
          </h4>
        </div>

        {/* Button to refresh deployed campaigns */}
        <button className={styles.card} onClick={handleRefreshButtonClick}>
          <h2>
            Refresh <span>&#x21BA;</span>
          </h2>
        </button>
      </div>

      {/* Form to create a new campaign */}
      <div className={styles.card}>
        <h2>Campaign Creation:</h2>
        <input
          type="text"
          placeholder="Description / title"
          value={description}
          onChange={handleDescriptionChange}
        />
        <input
          type="number"
          placeholder="Min Contrib (wei)"
          value={minContribution}
          onChange={handleMinContributionChange}
        />
        <button onClick={createCampaign}>
          Create Campaign <span>&#x1F680;</span>
        </button>
      </div>
      <p style={{ textAlign: "center", fontSize: "smaller" }}>
        1 eth = 10^18 wei | Minimum contribution: {minContributionETH} ETH
      </p>

      {/* Display deployed campaigns */}
      <div className={styles.grid}>
        {deployedCampaigns.map((campaign, index) => (
          <div
            className={styles.card}
            key={index}
            onClick={() => handleCampaignClick(campaign)} // not used, find alternative to this
          >
            <h2>
              {campaignDescriptions[campaign]} <span>&#x1F4C4;</span>
            </h2>

            <hr />

            <h4>id: {index + 0}</h4>
            <h3>{truncateAddress(campaign)}</h3>

            <hr />

            <p style={{ wordBreak: "break-all" }}>
              Instance address: {campaign}
            </p>

            {/* Interact with campaign */}
            <CampaignInteraction
              contractAddress={campaign}
              isConnected={isConnected}
              userAddress={userAddress}
              web3={web3}
              campaignDescriptions={campaignDescriptions}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
