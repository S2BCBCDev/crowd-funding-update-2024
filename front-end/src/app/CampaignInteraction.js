"use client";

import React, { useEffect, useState } from "react";
import Web3 from "web3";
import crowdCollabArtifact from "../../../hardhat-deployment/artifacts/contracts/CrowdCollab.sol/CrowdCollab.json";
import styles from "./page.module.css";

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

  const contributionAmountETH = contributionAmount / 10 ** 18;
  const requestAmountETH = requestAmount / 10 ** 18;

  return (
    <div>
      <div>
        <h5>Description:</h5>
        <h2>
          <strong>{campaignDescription}</strong>
        </h2>
      </div>
      <div>
        <h5>Campaign Manager:</h5>
        <p style={{ wordBreak: "break-all" }}>
          <strong>{manager}</strong>
        </p>
      </div>
      <div>
        <h5>Minimum Contribution en wei:</h5>
        <p style={{ wordBreak: "break-all" }}>
          <strong>{minimumContribution.toString()}</strong>
        </p>
      </div>
      <div>
        <h5>Contract Balance en wei:</h5>
        <p style={{ wordBreak: "break-all" }}>
          <strong>{contractBalance.toString()}</strong>
        </p>
      </div>
      <div>
        <h5>Number of Supporters:</h5>
        <p>
          <strong>{numberSupporters.toString()}</strong>
        </p>
      </div>
      <div>
        <h5>Number of Requests:</h5>
        <p>
          <strong>{requests.length}</strong>
        </p>
      </div>
      {/* Render request descriptions */}
      {requests.map((request, index) => (
        <div key={index}>
          <hr />
          <div>
            {/* Request details */}
            <h4>Request {index + 1}:</h4>
          </div>
          <div>
            <h5>Description:</h5>
            <p>
              <strong>{request.description}</strong>
            </p>
          </div>
          <div>
            <h5>Amount:</h5>
            <p>
              <strong>{request.amount.toString()}</strong>
            </p>
          </div>
          <div>
            <h5>Recipient Address:</h5>
            <p>
              <strong>{request.recipient}</strong>
            </p>
          </div>
          <div>
            <h5>Finalized status:</h5>
            <p>
              <strong>{request.complete.toString()}</strong>
            </p>
          </div>

          {/* Button to approve request */}
          <button onClick={() => approveRequest(index)}>
            Approve <span>&#x2714;</span>
          </button>
          {/* Button to finalize request */}
          <button onClick={() => finalizeRequest(index)}>
            Finalize <span>&#x1F389;</span>
          </button>
          {/* Note about request finalization */}
          <div>
            <em style={{ fontSize: "smaller", wordBreak: "keep-all" }}>
              To finalize a request, the number of approvals must exceed half of
              the total supporters.
            </em>
          </div>
        </div>
      ))}

      {/* Input field for contribution amount */}
      <hr />
      <h4>Support Campaign:</h4>
      <div>
        <p style={{ textAlign: "right", fontSize: "smaller" }}>
          {contributionAmountETH} ETH | <em>(1 eth = 10^18 wei)</em>
        </p>
        <input
          type="number"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          placeholder="Enter contribution amount"
        />
        {/* Button to trigger contribution */}
        <button onClick={handleContribution}>
          Contribute <span>&#x1F4B8;</span>
        </button>
      </div>

      {/* Create release fund request section */}

      <hr />

      <h4>Create release fund request:</h4>
      <p style={{ fontSize: "smaller" }}>
        Campaign manager can propose donation.
      </p>
      <div>
        <p style={{ textAlign: "right", fontSize: "smaller" }}>
          {requestAmountETH} ETH | <em>(1 eth = 10^18 wei)</em>
        </p>
      </div>
      <div>
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
      </div>

      {/* Button to create request */}
      <button onClick={createRequest}>
        Create Request <span>&#x1F4DD;</span>
      </button>
    </div>
  );
};

export default CampaignInteraction;
