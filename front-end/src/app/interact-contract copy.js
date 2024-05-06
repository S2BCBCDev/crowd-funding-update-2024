'use client'


const { useEffect, useState } = require('react');
import { ethers } from "ethers";
import styles from "./page.module.css";
import campaignCreatorArtifact from "../../../hardhat-deployment/artifacts/contracts/CampaignCreator.sol/CampaignCreator.json"; // Import the JSON file

export default function InteractContract() {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        setProvider(provider);
      }
    };

    initializeProvider();
  }, []);


  const [campaignCount, setCampaignCount] = useState(0);

  const contractAddress = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f"; // Replace with your contract address
  const contractABI = campaignCreatorArtifact.abi; // Replace with your contract ABI
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const getCampaignCount = async () => {
    const count = await contract.getCampaignCount();
    setCampaignCount(count.toNumber());
  };

  const createCampaign = async () => {
    const signer = provider.getSigner();
    const tx = await contract.createCampaign(1000, "New Campaign", { gasLimit: 300000 });
    await tx.wait();
    console.log("Campaign created successfully!");
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

        <button className={styles.card} onClick={createCampaign}>
          <h2>
            Create Campaign <span>-&gt;</span>
          </h2>
          <p>Create a new campaign</p>
        </button>
      </div>
    </main>
  );
}