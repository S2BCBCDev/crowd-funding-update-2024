// Hardhat config file

const { task } = require("hardhat/config");

// Require hardhat-waffle and ethers plugins
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
const { HardhatNetworkName } = require("hardhat/types");

// Define gas price (in wei)
const gasPrice = 1000000000; //process.env.GASPRICE;

// Define private keys and network settings
const privateKeys = ["8890c8f1e2ba20204b02fb84944a5b7b5ad2a86d3094aec41bc81110313ede7f"];
const network = "https://eth-sepolia.g.alchemy.com/v2/9FWrQu17X58viDvkYYZLjAWI9_3hQO8b";
const chainId = 11155111;

// Hardhat configuration
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {}, // default Hardhat network
    private_poa: { // Custom network for private POA
      url: network,
      chainId: chainId,
      accounts: privateKeys,
      gas: 6000000,
      gasPrice: gasPrice
    },
  },
  solidity: {
    version: "0.8.24", // specify Solidity compiler version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 1
  }
};
