import { ethers } from 'hardhat';
import CampaignFactory from './artifacts/contracts/CampaignCreator.sol/CampaignCreator.json';

const campaignFactoryAddress = "0x3983204c96C909c4796Ad933746BfFee767C768c";

export async function getCampaignFactoryInstance() {
  const provider = ethers.provider; // This line is fine if you are using the global provider
  return new ethers.Contract(campaignFactoryAddress, CampaignFactory.abi, provider);
}
