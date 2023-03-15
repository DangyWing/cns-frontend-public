import { BigNumber } from "ethers";
import { useContractReads } from "wagmi";
import { cnsABI } from "../constants/cnsABI";

export function useGetAllNamePrices() {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;

  const cnsContract = {
    abi: cnsABI,
    address: contractAddress,
  };

  const { data, isLoading, isError, error, refetch, isFetched, isSuccess } = useContractReads({
    contracts: [
      {
        ...cnsContract,
        functionName: "priceNameLength",
        args: [BigNumber.from(1)],
      },
      {
        ...cnsContract,
        functionName: "priceNameLength",
        args: [BigNumber.from(2)],
      },
      {
        ...cnsContract,
        functionName: "priceNameLength",
        args: [BigNumber.from(3)],
      },
      {
        ...cnsContract,
        functionName: "priceNameLength",
        args: [BigNumber.from(4)],
      },
      {
        ...cnsContract,
        functionName: "priceNameLength",
        args: [BigNumber.from(5)],
      },
      {
        ...cnsContract,
        functionName: "priceNameLength",
        args: [BigNumber.from(6)],
      },
    ],
    watch: true,
    cacheTime: 10_000,
  });

  if (!data || data === undefined) {
    return {
      data: [
        BigNumber.from(0),
        BigNumber.from(0),
        BigNumber.from(0),
        BigNumber.from(0),
        BigNumber.from(0),
        BigNumber.from(0),
      ],
      isLoading,
      isError,
      error,
      refetch,
      isFetched,
    };
  }

  return { data, isLoading, isError, error, refetch, isFetched, isSuccess };
}
