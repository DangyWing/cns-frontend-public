import type { Address } from "wagmi";
import { useContractRead } from "wagmi";
import { cnsABI } from "../constants/cnsABI";

export function useCheckIfAllowlistClaimed({ address, enabled }: { address: Address | undefined; enabled: boolean }) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;

  const { data, isLoading, isError, error, refetch, isFetched } = useContractRead({
    abi: cnsABI,
    address: contractAddress,
    functionName: "allowlistClaimed",
    args: [address ?? "0xdead"],
    enabled: !!address && enabled,
  });

  return { data, isLoading, isError, error, refetch, isFetched };
}
