import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";
import { cnsABI } from "../constants/cnsABI";
import type { NameDetailsResult } from "../types/types";

export async function useGetNameDetailsById({
  tokenId,
}: {
  tokenId: string | BigNumber;
}): Promise<NameDetailsResult | null> {
  if (typeof tokenId === "string") {
    tokenId = BigNumber.from(tokenId);
  }

  const expiry = await readContract({
    abi: cnsABI,
    address: process.env.CNS_CONTRACT_ADDRESS,
    functionName: "expiry",
    args: [BigNumber.from(tokenId)],
  });

  const name = await readContract({
    abi: cnsABI,
    address: process.env.CNS_CONTRACT_ADDRESS,
    functionName: "tokenToName",
    args: [BigNumber.from(tokenId)],
  });

  if (!name) return null;

  return {
    expiry: expiry,
    name: name,
  };
}
