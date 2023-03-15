import type { Address } from "wagmi";
import { useContractRead } from "wagmi";
import { cnsABI } from "../constants/cnsABI";
import { primaryNameAtom } from "../atoms";
import { useSetAtom } from "jotai";

export function useGetPrimaryNameFromAddress(address: Address | undefined) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;
  const setPrimaryName = useSetAtom(primaryNameAtom);

  const { data, isLoading, isError, error, refetch, isFetched, isSuccess } = useContractRead({
    abi: cnsABI,
    address: contractAddress,
    functionName: "getPrimary",
    args: [address ?? "0x"],
    enabled: !!address,
    onSuccess: (data) => {
      setPrimaryName(data);
    },
  });

  const primaryName = data;

  return { primaryName, isLoading, isError, error, refetch, contractAddress, isFetched, isSuccess };
}
