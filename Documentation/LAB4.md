# Blockchain & Solidity Lab4 – Voting dApp Development

### S2BC

<div style="text-align: center;">
  <img src="src/s2bc-logo.svg" alt="Alt text" width="96" height="96">
</div>

---

### Lab 4: Run a dApp and Consider Next Steps
- BUILD / TEST / INTEGRATE / **RUN**

---

So far, you've followed the steps in Labs 1 to 3, gaining valuable insights into the core components of blockchain development. Now, in Lab 4, we will discuss crucial considerations for running a dApp in Morpheus.

## 1. Running the Frontend

Follow these steps to run the frontend of your voting Dapp:

1. **Start the Frontend Server:**
   - Navigate to the `voting-dapp-2023/frontend` directory.
   - Run the following command:
     ```bash
     node server.js
     ```
   This will initiate the server for your Dapp's frontend.

2. **Open the Web App in Morpheus:**
   - In your Morpheus IDE interface, locate the CDE menu in the left menu bar.

   <div style="text-align: center;">
     <img src="src/morpheus-screeshoot/CDE_service.png" alt="CDE menu">
   </div>

   - Click on the node service to open your web app.

These steps ensure that your frontend server is up and running, and you can access your voting Dapp through Morpheus.

## 2. Trying the Voting Dapp

1. **Connect to Metamask:**
   - Click the connect button. A Metamask popup will appear, asking if you want to connect. Accept using the deployer account.

2. **Check Voting Status:**
   - View the Voting status in the Vote Panel:
     <div style="text-align: center;">
       <img src="src/morpheus-screeshoot/votingPanel.png" alt="Voting Panel" style="width:500px">
     </div>

3. **Start an Election:**
   - Visit the Administrator Panel to initiate an election:
     <div style="text-align: center;">
       <img src="src/ui-screenshoot/start-election.jpg" alt="Start Election" style="width:300px">
     </div>
   - Provide election details (title, candidates, duration) and click the "Start Election" button.

4. **Register Voters:**
   <div style="text-align: center;">
     <img src="src/ui-screenshoot/register-voters.jpg" alt="Register Voters" style="width:300px">
   </div>

5. **Monitor Ongoing Election:**
   - Return to the Vote Panel to view ongoing election information.

6. **Cast a Vote:**
   - Participate in the election by casting your vote.

7. **End the Election:**
   - In the Admin Panel, conclude the election by clicking the "End Election" button.

8. **Mint Results:**
   - Once the election is completed, mint the results using the "Mint Results" button.

9. **Reinitialize Election:**
   - After everything is finished, reinitialize the election by clicking on "Reinitialize" in the Admin Panel.

10. **Console Logs:**
   - Open your browser's developer console (F12) to view relevant console logs while navigating the app.

## 3. Migrating to Sepolia Testnet and Utilizing Etherscan

To successfully migrate your dApp to the Sepolia Testnet and leverage Etherscan for enhanced visibility, follow the steps below:

### Step 1: Obtain RPC_URL and Etherscan API Key

1.1 Obtain the RPC_URL for Sepolia from Morpheus, Alkemy's website, or Infura.

1.2 Obtain a free Etherscan API Key from the Etherscan website.

### Step 2: Update Configuration Files

2.1 Open your **.env** file and modify the values as follows:

```env
RPC_URL="https://eth-sepolia.g.alchemy.com/v2/APIKEY"
PRIVATE_KEY="00000...000" 
API_KEY="APIKEYFROMETHERSCAN"
```

Ensure the private key corresponds to the deployer account on Sepolia. You can use any account created with Metamask, and acquire testnet ETH from a faucet like Alkemy faucet.

2.2 Update the `chainID` in your `hardhat.config.js` file from 1303 to 11155111. Then change the network name "votingchain" to "sepolia"

```
require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
  paths: {
    artifacts: "./src/artifacts",
    contracts: './src/contracts',
  }
};

```

2.3 In your `frontend/public/script.js` file, replace all occurrences of "1303" with "11155111" to ensure the frontend connects to the Sepolia chainID.

Tip: You can select **1305**, then do Ctrl+D several times to get all occurences selected, and then past 11155111.

Certainly! Here's an organized and clear version of your tutorial:

---

**2.3 Update ChainID in `frontend/public/script.js` File**

To ensure that your frontend connects to the Sepolia chainID, follow these steps to replace all occurrences of "1303" with "11155111" in the `frontend/public/script.js` file.

**Manual Method:**

1. Open your text editor and navigate to the `frontend/public/script.js` file.

2. Locate the first occurrence of "1303" and position your cursor at the beginning of the number.

3. Press `Ctrl + D` (or `Cmd + D` on macOS) to select the current occurrence.

4. Continue pressing `Ctrl + D` until all instances of "1303" are selected.

5. Type "11155111" to replace the selected occurrences.

6. Save the file.

**Alternative Method using Find and Replace:**

1. Open the `frontend/public/script.js` file in your text editor.

2. Use the find function (`Ctrl + F` or `Cmd + F`) to search for "1303."

3. Click on "Replace" or "Replace All."

4. Enter "11155111" as the replacement and confirm the action.

5. Save the file.

--- 

### Step 3: Redeploy the Contract on Sepolia

3.1 Navigate to the hardhat folder in your terminal.

3.2 Run the following command to redeploy the contract on Sepolia:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 4: Update Contract Address in Frontend

4.1 Once the deployment is complete, locate the voting contract address.

4.2 Copy the contract address and update the variable in `frontend/public/script.js` as follows:

```javascript
const contractAddress = 'votingcontractaddress';
```

### Step 5: Restart the Server

5.1 Start or restart your server using the following command:

```bash
node frontend/server.js
```

### Step 6: Verification on Etherscan

6.1 If you have chosen to verify your contract on Etherscan, you have two methods available:

#### Method 1: Using Hardhat

To verify your contract using Hardhat, follow these steps:

1. Navigate to your Hardhat directory in the terminal.

2. Run the following command, replacing `<votingcontractaddress>` with the actual address of your deployed contract:

```bash
npx hardhat verify <votingcontractaddress> --network sepolia
```

3. Review the response in the terminal to confirm the success or any output related to the verification process.

4. Check Etherscan to verify if the contract has been successfully verified.

#### Method 2: Using Etherscan Interface

An alternative method is to use the Etherscan interface directly. Provide the following information to Etherscan:

- Contract Code
- Compiler Version
- ABI (Application Binary Interface) of the contract

This method involves interacting with the Etherscan website to manually input the required details for verification.

Choose the method that best fits your workflow or preference. Successful verification ensures transparency and allows users to explore transactions and events within the voting contract on Etherscan, providing detailed insights at each step of the election.

### Step 7: Test the New Setup

7.1 Retry launching a new election on this updated setup to ensure seamless functionality.

By following these steps, your dApp should now be successfully migrated to the Sepolia Testnet, utilizing the specified RPC_URL and providing enhanced insights through Etherscan verification.

Explore the following Etherscan screenshots for a visual confirmation:


https://sepolia.etherscan.io/

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/select-metamask-small.png">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/metamask-sepolia-select.png">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/start-new-election.png" width="500px">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/voted-front.png" width="500px">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/tx-infos-method.png" width="500px">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/tx-info-method-precise.png">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/green-arrow-verify.png">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/tx-details.png" width="500px">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/encoded-data.png" width="300px">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/decode-input-data-button.png">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/token-uri-decoded.png">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/nft-notification.png" width="500px">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/nft.png" width="500px">
</div>

<div style="text-align: center;">
  <img style="border-radius: 12px;"  src="src/etherscan-screenshots/events-voting.png" width="500px">
</div>

---

## 4. Uploading Your dApp on Morpheus app library to share with community

For detailed steps on uploading your dApp, refer to the [documentation](https://docs.morpheuslabs.io/docs/submit-app-to-the-app-store).

https://docs.morpheuslabs.io/docs/submit-app-to-the-app-store
---

<div style="text-align: center;">
  <img src="src/s2bc-logo.svg" alt="S2BC Logo" width="96">
</div>


