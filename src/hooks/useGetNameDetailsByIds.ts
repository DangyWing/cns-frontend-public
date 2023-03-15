import type { BigNumber } from "ethers";
import { useMemo } from "react";
import { useContractReads } from "wagmi";
import { cnsABI } from "../constants/cnsABI";

export function useGetNameDetailsByIds({
  tokenIdsToReturn,
  enabled,
}: {
  tokenIdsToReturn: BigNumber[] | undefined;
  enabled: boolean;
}) {
  const contracts = useMemo(() => {
    return tokenIdsToReturn?.flatMap((tokenId) => [
      {
        address: process.env.CNS_CONTRACT_ADDRESS,
        abi: cnsABI,
        functionName: "expiry",
        args: [tokenId],
        enabled: !!tokenIdsToReturn && enabled,
      },
      {
        address: process.env.CNS_CONTRACT_ADDRESS,
        abi: cnsABI,
        functionName: "tokenToName",
        args: [tokenId],
        enabled: !!tokenIdsToReturn && enabled,
      },
    ]);
  }, [enabled, tokenIdsToReturn]);

  const nameDetails: { expiry: BigNumber; name: string }[] = [];

  const { isLoading, isSuccess, error, refetch, isError } = useContractReads({
    contracts: contracts,
    select: (data) => {
      const tempNameDetails = data as string | BigNumber[];
      for (let i = 0; i < tempNameDetails.length; i += 2) {
        nameDetails.push({ expiry: tempNameDetails[i] as BigNumber, name: tempNameDetails[i + 1] as string });
      }

      return nameDetails;
    },
  });

  return { nameDetails, isError, isLoading, error, refetch, isSuccess };
}
