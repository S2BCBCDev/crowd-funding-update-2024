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
    //const web3 = new Web3("https://votingchain-29886.morpheuslabs.io");
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
    window.location.reload();
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
      {/* Campaign details section */}
      <h4>Campaign details:</h4>
      <p>
        Description: <strong>{campaignDescription}</strong>
      </p>
      <p style={{ wordBreak: "break-all" }}>
        Manager: <strong>{manager}</strong>
      </p>
      <p style={{ wordBreak: "break-all" }}>
        Minimum Contribution: <strong>{minimumContribution.toString()}</strong>
      </p>
      <p style={{ wordBreak: "break-all" }}>
        Contract Balance: <strong>{contractBalance.toString()}</strong>
      </p>
      <p>
        Number of Supporters: <strong>{numberSupporters.toString()}</strong>
      </p>
      <p>
        Number of Requests: <strong>{requests.length}</strong>
      </p>

      {/* Render request descriptions */}
      {requests.map((request, index) => (
        <div key={index}>
          <hr />
          {/* Request details */}
          <h4>Request {index + 1}:</h4>
          <p>
            Description: <strong>{request.description}</strong>
          </p>
          <p>
            Amount: <strong>{request.amount.toString()}</strong>
          </p>
          <p style={{ wordBreak: "break-all" }}>
            Recipient Address: <strong>{request.recipient}</strong>
          </p>
          <p>
            Finalized ?: <strong>{request.complete.toString()}</strong>
          </p>

          {/* Button to approve request */}
          <button onClick={() => approveRequest(index)}>Approve</button>
          {/* Button to finalize request */}
          <button onClick={() => finalizeRequest(index)}>Finalize</button>
          {/* Note about request finalization */}
          <h6>
            <em>
              To finalize a request, the number of approvals must exceed half of
              the total supporters.
            </em>
          </h6>
        </div>
      ))}

      {/* Input field for contribution amount */}
      <hr />
      <h4>Contribute to campaign:</h4>
      <input
        type="number"
        value={contributionAmount}
        onChange={(e) => setContributionAmount(e.target.value)}
        placeholder="Enter contribution amount"
      />
      {/* Button to trigger contribution */}
      <button onClick={handleContribution}>Contribute</button>

      {/* Create release fund request section */}
      <div>
        <hr />
        <h4>Create release fund request:</h4>
        <input
          type="text"
          value={requestDescription}
          onChange={(e) => setRequestDescription(e.target.value)}
          placeholder="request description"
        />
        <input
          type="number"
          value={requestAmount}
          onChange={(e) => setRequestAmount(e.target.value)}
          placeholder="request amount"
        />
        <input
          type="text"
          value={requestRecipient}
          onChange={(e) => setRequestRecipient(e.target.value)}
          placeholder="recipient address"
        />
        {/* Button to create request */}
        <button onClick={createRequest}>Create Request</button>
      </div>
    </div>
  );
};

export default CampaignInteraction;
