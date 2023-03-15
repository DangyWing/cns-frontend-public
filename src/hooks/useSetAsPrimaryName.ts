import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { cnsABI } from "../constants/cnsABI";
import { nameToTokenId } from "../utils/nameToTokenId";
import { burnAddress } from "../constants/burnAddress";
import { primaryNameAtom } from "../atoms";
import { useSetAtom } from "jotai";

export function useSetAsPrimaryName({ name, enabled }: { name: string; enabled: boolean }) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;
  const tokenId = nameToTokenId(name);
  const setPrimaryName = useSetAtom(primaryNameAtom);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: cnsABI,
    functionName: "setPrimaryName",
    args: [tokenId ?? BigNumber.from(0), burnAddress],
    enabled: !!tokenId && enabled && !!burnAddress,
  });

  const { data, isLoading, write, error, status, reset } = useContractWrite({
    ...config,
  });

  const { isSuccess, isLoading: isLoadingWaitForSetPrimary } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess: () => {
      setPrimaryName(name);
    },
  });

  return { data, isLoading, isSuccess, write, error, status, reset, isLoadingWaitForSetPrimary };
}
