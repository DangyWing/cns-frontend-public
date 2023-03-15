import type { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import { cnsABI } from "../constants/cnsABI";

export function useFindOwnerOfName({ tokenId, enabled }: { tokenId: BigNumber; enabled: boolean }) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;

  const { data, isLoading, isError, error, refetch } = useContractRead({
    abi: cnsABI,
    address: contractAddress,
    functionName: "ownerOf",
    enabled: enabled,
    args: [tokenId],
  });

  return { data, isLoading, isError, error, refetch, contractAddress };
}
