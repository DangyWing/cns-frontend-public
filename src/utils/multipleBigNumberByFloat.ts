import { BigNumber, utils } from "ethers";

export function multiplyBigNumber(bn: BigNumber | string, number: number): BigNumber {
  const bnForSure = BigNumber.from(bn);
  const numberBN = utils.parseUnits(number.toString(), 18);

  return bnForSure.mul(numberBN).div(utils.parseUnits("1", 18));
}
