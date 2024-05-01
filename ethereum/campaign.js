import { ethers } from 'hardhat';
import Campaign from './artifacts/contracts/CrowdCollab.sol/CrowdCollab.json';

export default function getContractInstance(address) {
  const provider = ethers.provider; // This line is fine if you are using the global provider
  return new ethers.Contract(address, Campaign.abi, provider);
}
