import { ethers } from "ethers";
import { SUPPLY_CHAIN_ADDRESS } from "../config";
import ABI from "../SupplyChain.json";

export const getSupplyChainContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask is not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(SUPPLY_CHAIN_ADDRESS, ABI.abi, signer);
};
