import { useContractRead } from "wagmi";

import { cnsABI } from "../constants/cnsABI";

export function useCheckMintStatus() {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;

  const { data, isLoading, isError, error, refetch, isFetched } = useContractRead({
    address: contractAddress,
    abi: cnsABI,
    functionName: "status",
  });

  const mintStatus = data?.toString() ?? "0";

  return { mintStatus, isLoading, isError, error, refetch, isFetched };
}
