import type { Address } from "@wagmi/core";
import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import { cnsABI } from "../constants/cnsABI";
import { burnAddress } from "../constants/burnAddress";

type Mutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type MutableAddresses = Mutable<Address[]>;

export function useGetTokenRightsHolders({
  tokenId,
  enabled,
  vault,
}: {
  tokenId: string | BigNumber;
  enabled: boolean;
  vault?: Address;
}): Address[] | undefined {
  if (typeof tokenId === "string") {
    tokenId = BigNumber.from(tokenId);
  }

  const { data: address } = useContractRead({
    abi: cnsABI,
    address: process.env.CNS_CONTRACT_ADDRESS,
    functionName: "nameRightsHolders",
    args: [tokenId, vault ?? burnAddress],
    enabled: enabled,
  });

  return address as MutableAddresses;
}
