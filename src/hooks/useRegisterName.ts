import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { cnsABI } from "../constants/cnsABI";
import { useGetNamePrice } from "./useGetNamePrice";
import { BigNumber } from "ethers";
import { multiplyBigNumber } from "../utils/multipleBigNumberByFloat";
import { stringLength } from "../utils/stringLength";

export function useRegisterName({
  name,
  yearsToRegister,
  signature,
  enabled,
}: {
  name: string;
  yearsToRegister: BigNumber;
  signature: `0x${string}`;
  enabled: boolean;
}) {
  const contractAddress = process.env.CNS_CONTRACT_ADDRESS;
  const { data: price, isSuccess: isSuccessGetPrice } = useGetNamePrice(BigNumber.from(stringLength(name)));

  const adjustedPrice = multiplyBigNumber(price.mul(yearsToRegister), 1.05);

  const overrides = {
    value: adjustedPrice,
  };

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: cnsABI,
    functionName: "registerName",
    overrides: overrides,
    enabled: enabled && !!name && !!yearsToRegister && isSuccessGetPrice && !!signature,
    args: [name, yearsToRegister, signature],
  });

  const { data, isLoading, write, writeAsync, error, isError } = useContractWrite(config);

  const { isSuccess, isFetching } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  return { data, isLoading, isSuccess, write, writeAsync, isFetching, error, isError };
}
