import Link from "next/link";
import { ShowPrimaryCNS } from "./ShowPrimaryCNS";
import { useGetBalanceOfOwnedNames } from "../hooks/useGetBalanceOfOwnedNames";
import { useGetTokenIdsOwnedByAddress } from "../hooks/useGetTokenIdsOwnedByAddress";
import { useGetNameDetailsByIds } from "../hooks/useGetNameDetailsByIds";
import { RegisteredCNSTable } from "./RegisteredNameTable/RegisteredCNSTable";
import { useIsMounted } from "../hooks/useIsMounted";
import { LoadingIndicator } from "./LoadingIndicator";
import type { Address } from "wagmi";
import { middleEllipsize } from "../utils/ellipsize";
import { primaryNameAtom } from "../atoms";
import { useAtomValue } from "jotai";
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { BigNumber } from "ethers";

export const ShowWalletDetails = ({ walletAddress }: { walletAddress: Address }) => {
  const isMounted = useIsMounted();
  const { data: walletBalance, isLoading: isLoadingOwnedNames } = useGetBalanceOfOwnedNames(walletAddress);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: tokenIds,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess: isSuccessTokenIds,
  } = useGetTokenIdsOwnedByAddress(walletAddress, pageIndex, pageSize, setPagination, walletBalance);

  const tokenIdsToReturn = tokenIds?.pages
    .flat()
    .map((tokenId) => {
      return tokenId;
    })
    .filter((tokenId) => tokenId !== undefined) as BigNumber[];

  const {
    nameDetails,
    isLoading: isLoadingNameDetailsByIds,
    isSuccess,
  } = useGetNameDetailsByIds({ tokenIdsToReturn: tokenIdsToReturn, enabled: isSuccessTokenIds });

  const primaryName = useAtomValue(primaryNameAtom);

  const isAnyLoading = isLoading || isLoadingOwnedNames || isLoadingNameDetailsByIds;

  if (!isMounted) return null;

  if (!nameDetails) return <div>LOADING...</div>;

  if (isAnyLoading || !isSuccess || !isMounted)
    return (
      <div>
        <LoadingIndicator />
      </div>
    );

  if (tokenIdsToReturn === undefined || tokenIdsToReturn.length === 0 || !tokenIdsToReturn) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center">
        <div className="m-4 text-cantoError">- no names registered for {middleEllipsize(walletAddress)} -</div>
        <Link
          key="home"
          href={"/"}
          className={
            " mt-12 w-16 border border-cantoGreenDark p-3 text-sm font-medium text-cantoGreenDark hover:bg-cantoGreenDarker hover:text-black"
          }
        >
          home
        </Link>
      </div>
    );
  }

  const handleNextPageclick = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log("fetching next page");
      await fetchNextPage?.();
    }
  };

  const cleanBalance = walletBalance ?? BigNumber.from(0);

  return (
    <main className="m-4 p-4">
      <div className="py-2 px-4">
        <div className="mb-2">
          <Link
            href={`https://evm.explorer.canto.io/address/${walletAddress} `}
            className={"text-xl font-semibold text-cantoGreen"}
          >
            {primaryName ?? middleEllipsize(walletAddress)}
          </Link>
        </div>
        <div className="px-0">{nameDetails && primaryName && <ShowPrimaryCNS primaryName={primaryName} />}</div>

        {nameDetails && (
          <div>
            <button
              onClick={() => {
                void handleNextPageclick();
              }}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Load More
            </button>
            <RegisteredCNSTable
              data={nameDetails.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))}
              primaryName={primaryName}
              hasNextPage={!!hasNextPage}
              walletBalance={cleanBalance.toNumber()}
              setPagination={setPagination}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </div>
        )}
      </div>
    </main>
  );
};
