import type { Address } from "wagmi";
import { nameToTokenId } from "../utils/nameToTokenId";
import { useGetTokenRightsHolders } from "./useGetTokenRightsHolders";

export const useCNSLookup = ({ name }: { name: string }): Address[] | undefined => {
  const tokenId = nameToTokenId(name);

  const addresses = useGetTokenRightsHolders({ tokenId: tokenId, enabled: tokenId.toString() !== "0" });

  return addresses;
};
