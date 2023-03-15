import { BigNumber, ethers } from "ethers";

export const nameToTokenId = (name: string | undefined): BigNumber => {
  if (!name) {
    return BigNumber.from(0);
  }
  return BigNumber.from(ethers.utils.solidityKeccak256(["string"], [name.toLowerCase()]));
};
