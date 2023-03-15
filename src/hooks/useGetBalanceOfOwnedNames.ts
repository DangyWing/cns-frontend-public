import type { Address } from "wagmi";
import { useContractRead } from "wagmi";
import { cnsABI } from "../constants/cnsABI";

export function useGetBalanceOfOwnedNames(address: Address) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;

  const { data, isLoading, refetch, error, isFetched } = useContractRead({
    abi: cnsABI,
    address: contractAddress,
    functionName: "balanceOf",
    args: [address],
  });

  return { data, isLoading, refetch, error, isFetched };
}
