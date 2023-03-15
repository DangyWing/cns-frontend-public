import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";

import { cnsABI } from "../constants/cnsABI";

export function useGetNamePrice(length: BigNumber | number) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;

  if (typeof length === "number") {
    length = BigNumber.from(length);
  }

  const validLength = length.gte(1);

  const { data, isLoading, isError, error, refetch, isSuccess } = useContractRead({
    abi: cnsABI,
    address: contractAddress,
    functionName: "priceNameLength",
    args: [length],
    enabled: validLength,
  });

  if (!data) {
    return { data: BigNumber.from(1), isLoading, isError, error, refetch, isSuccess };
  }

  return { data, isLoading, isError, error, refetch, isSuccess };
}
