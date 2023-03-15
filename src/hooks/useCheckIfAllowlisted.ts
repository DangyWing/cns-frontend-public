import type { Address } from "wagmi";
import { allowedAddresses } from "../constants/allowedAddresses";

export function useCheckIfAllowlisted({ address }: { address: Address | undefined }): {
  address: Address | null;
  name: string | null;
} {
  if (!address) return { address: null, name: null };

  const allowedAddress = allowedAddresses.find((allowedAddress) => {
    if (address === allowedAddress.address) {
      return allowedAddress;
    }
  });

  return { address: allowedAddress?.address ?? null, name: allowedAddress?.name ?? null };
}
