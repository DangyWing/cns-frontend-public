import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { cnsABI } from "../constants/cnsABI";
import { primaryNameAtom } from "../atoms";
import { useSetAtom } from "jotai";

export function useClearPrimaryName({ enabled }: { enabled: boolean }) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;
  const setPrimaryName = useSetAtom(primaryNameAtom);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: cnsABI,
    functionName: "clearPrimaryName",
    enabled: enabled,
  });

  const { data, isLoading, isSuccess, write, error, status, reset } = useContractWrite({
    ...config,
  });

  const waitForTransaction = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess: () => {
      setPrimaryName(undefined);
    },
  });

  return { data, isLoading, isSuccess, write, waitForTransaction, error, status, reset };
}
