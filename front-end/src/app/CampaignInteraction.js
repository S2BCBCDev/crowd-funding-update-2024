"use client";

import React, { useEffect, useState } from "react";
import Web3 from "web3";
import crowdCollabArtifact from "../../../hardhat-deployment/artifacts/contracts/CrowdCollab.sol/CrowdCollab.json";

const contractAbi = crowdCollabArtifact.abi;

const CampaignInteraction = ({ contractAddress, web3 }) => {
  const [contractInstance, setContractInstance] = useState(null);
  const [campaignDescription, setCampaignDescription] = useState("");
  const [manager, setManager] = useState("");
  const [minimumContribution, setMinimumContribution] = useState(0);
  const [minimumContributionShow, setMinimumContributionShow] = useState(0);

  const [numberSupporters, setNumberSupporters] = useState(0);
  const [requests, setRequests] = useState([]);
  const [contributionAmount, setContributionAmount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const [requestDescription, setRequestDescription] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestRecipient, setRequestRecipient] = useState("");

  const [approvalCounts, setApprovalCounts] = useState([]);
  const [contractBalance, setContractBalance] = useState([]);

  useEffect(() => {
    const web3 = new Web3("http://localhost:8545");
    const instance = new web3.eth.Contract(contractAbi, contractAddress);
    setContractInstance(instance);
  }, [contractAddress]);

  useEffect(() => {
    const getSummary = async () => {
      try {
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

          // Fetch requests
          const requestsCount = await contractInstance.methods
            .getRequestsCount()
            .call();
          const requestsArray = [];
          for (let i = 0; i < requestsCount; i++) {
            const request = await contractInstance.methods.requests(i).call();
            requestsArray.push(request);
          }
          setRequests(requestsArray);

          // Fetch contract balance
          const contractBalance = await web3.eth.getBalance(
            contractInstance.options.address
          );
          setContractBalance(contractBalance);
        }
      } catch (error) {
        console.error("Error getting contract summary:", error);
      }
    };

    getSummary();
  }, [contractInstance]);

  const handleContribution = async () => {
    try {
      if (!window.ethereum) {
        console.error("MetaMask extension not detected");
        return;
      }

      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.getAccounts();
      const senderAddress = accounts[0];

      // Initialize contract instance
      const contractInstance = new web3Instance.eth.Contract(
        contractAbi,
        contractAddress
      );

      // Perform the contribution
      await contractInstance.methods.contribute().send({
        value: contributionAmount,
        from: senderAddress,
      });

      // Refresh campaign summary after contribution
      // getSummary();
    } catch (error) {
      console.error("Error contributing to campaign:", error);
    }
    window.location.reload();
  };

  const createRequest = async () => {
    try {
      if (!window.ethereum) {
        console.error("MetaMask extension not detected");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.getAccounts();
      const senderAddress = accounts[0];

      const contractInstance = new web3Instance.eth.Contract(
        contractAbi,
        contractAddress
      );

      await contractInstance.methods
        .createRequest(requestDescription, requestAmount, requestRecipient)
        .send({ from: senderAddress });
    } catch (error) {
      console.error("Error creating request:", error);
    }
    // window.location.reload();
  };

  const approveRequest = async (requestId) => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.getAccounts();
      const senderAddress = accounts[0];

      const contractInstance = new web3Instance.eth.Contract(
        contractAbi,
        contractAddress
      );

      await contractInstance.methods.approveRequest(requestId).send({
        from: senderAddress,
      });
    } catch (error) {
      console.error("Error approving request:", error);
    }
    window.location.reload();
  };

  const finalizeRequest = async (requestId) => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.getAccounts();
      const senderAddress = accounts[0];

      const contractInstance = new web3Instance.eth.Contract(
        contractAbi,
        contractAddress
      );

      await contractInstance.methods.finalizeRequest(requestId).send({
        from: senderAddress,
      });
    } catch (error) {
      console.error("Error finalizing request:", error);
    }
    window.location.reload();
  };

  return (
    <div>
      <h2>Campaign Interactions:</h2>
      <p>Description: {campaignDescription}</p>
      <p style={{ wordBreak: "break-all" }}>Manager: {manager}</p>
      <p style={{ wordBreak: "break-all" }}>
        Minimum Contribution: {minimumContribution.toString()}
      </p>
      <p style={{ wordBreak: "break-all" }}>
        Contract Balance: {contractBalance.toString()}
      </p>
      <p>Number of Supporters: {numberSupporters.toString()}</p>
      <p>Number of Requests: {requests.length}</p>
      {/* Render request descriptions */}
      {requests.map((request, index) => (
        <div key={index}>
          <hr />
          <p>Request {index + 1}:</p>
          <p>Description: {request.description}</p>
          <p>Amount: {request.amount.toString()}</p>
          <p style={{ wordBreak: "break-all" }}>
            Recipient Address: {request.recipient}
          </p>
          <p>Finalized ?: {request.complete.toString()}</p>
          {console.log(request.complete)}

          {/* Button to approve request */}
          <button onClick={() => approveRequest(index)}>Approve</button>
          {/* Button to finalize request */}
          <button onClick={() => finalizeRequest(index)}>Finalize</button>
        </div>
      ))}
      {/* Input field for contribution amount */}
      <hr />
      Contribution/Support:
      <input
        type="number"
        value={contributionAmount}
        onChange={(e) => setContributionAmount(e.target.value)}
        placeholder="Enter contribution amount"
      />
      {/* Button to trigger contribution */}
      <button onClick={handleContribution}>Contribute</button>
      <div>
        {/* Render requests here */}
        <hr />
        Request:
        <h3>Create Request</h3>
        <input
          type="text"
          value={requestDescription}
          onChange={(e) => setRequestDescription(e.target.value)}
          placeholder="Enter request description"
        />
        <input
          type="number"
          value={requestAmount}
          onChange={(e) => setRequestAmount(e.target.value)}
          placeholder="Enter request amount"
        />
        <input
          type="text"
          value={requestRecipient}
          onChange={(e) => setRequestRecipient(e.target.value)}
          placeholder="Enter request recipient address"
        />
        <button onClick={createRequest}>Create Request</button>
      </div>
    </div>
  );
};

export default CampaignInteraction;
