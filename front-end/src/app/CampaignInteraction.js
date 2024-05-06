'use client'

import React, { useEffect, useState } from 'react';

// import React from 'react';
import Web3 from 'web3';
import crowdCollabArtifact from "../../../hardhat-deployment/artifacts/contracts/CrowdCollab.sol/CrowdCollab.json";

const contractAbi = crowdCollabArtifact.abi;
// const contractAddress = '0x875A3b9fAE069AD47de9dDb3A1f4465bF54A1993'; // Replace with your deployed contract address

const CampaignInteraction = ({ contractAddress }) => {
    const [contractInstance, setContractInstance] = useState(null);
    const [campaignDescription, setCampaignDescription] = useState('');

    useEffect(() => {
        const web3 = new Web3('http://localhost:8545');
        const instance = new web3.eth.Contract(contractAbi, contractAddress);
        setContractInstance(instance);
    }, [contractAddress]);

    useEffect(() => {
        const getSummary = async () => {
            try {
                console.log('Fetching contract summary...');
                if (contractInstance) {
                    const campaignDescription = await contractInstance.methods.campaignDescription().call();
                    console.log('Campaign Description:', campaignDescription);
                    setCampaignDescription(campaignDescription);
                }
            } catch (error) {
                console.error('Error getting contract summary:', error);
            }
        };

        getSummary();
    }, [contractInstance]);



    return (
        <div>
            <h2>Campaign Interaction</h2>
            <p>Description: {campaignDescription}</p>
        </div>
    );
};

export default CampaignInteraction;
