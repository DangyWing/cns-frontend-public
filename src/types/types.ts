import type { BigNumber } from "ethers";

export type NameDetailsResult = {
  expiry: BigNumber;
  name: string;
};

export type CNSName = `${string}.canto`;
