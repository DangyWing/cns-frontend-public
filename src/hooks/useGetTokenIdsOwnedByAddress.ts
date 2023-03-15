import { BigNumber } from "ethers";
import type { Address } from "wagmi";
import { useContractInfiniteReads, paginatedIndexesConfig } from "wagmi";
import { cnsABI } from "../constants/cnsABI";
import type { PaginationState } from "@tanstack/react-table";
import { canto } from "wagmi/chains";

export function useGetTokenIdsOwnedByAddress(
  address: Address,
  pageIndex: number,
  pageSize: number,
  setPagination: (pagination: PaginationState) => void,
  balance?: BigNumber
) {
  const cleanBalance = balance?.toNumber() ?? 0;

  const perPage = pageIndex * pageSize > cleanBalance ? cleanBalance : pageSize;

  const { data, fetchNextPage, isLoading, refetch, error, isFetched, hasNextPage, isFetchingNextPage, isSuccess } =
    useContractInfiniteReads({
      cacheKey: `tokenIdsByAddress ${pageIndex}`,
      ...paginatedIndexesConfig(
        (index) => {
          return [
            {
              abi: cnsABI,
              address: process.env.CNS_CONTRACT_ADDRESS,
              functionName: "tokenOfOwnerByIndex",
              chainId: canto.id,
              args: [address, BigNumber.from(index as number)] as const,
            },
          ];
        },
        { start: pageIndex * pageSize, perPage: perPage, direction: "increment" }
      ),
      enabled: !!address && !!balance,
      keepPreviousData: true,
      select: (data) => ({
        ...data,
        pages: data.pages.flat().map((tokenId) => {
          if (tokenId != undefined) {
            return tokenId as BigNumber;
          }
        }),
      }),
    });

  if (data === undefined) return { data: null, isLoading, refetch, error, isFetched, fetchNextPage, isSuccess: false };

  return { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, refetch, error, isFetched, isSuccess };
}
