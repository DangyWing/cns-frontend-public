import type { Address } from "wagmi";
import { useQuery } from "@tanstack/react-query";

type SignatureData = {
  address: Address;
  name: string;
  signature: `0x${string}`;
};

export function useGetSignatureForAddressAndName({
  address,
  name,
  enabled,
}: {
  address: Address;
  name: string;
  enabled: boolean;
}) {
  const { data, refetch } = useQuery({
    queryKey: ["signature", address, name],
    queryFn: async () => {
      const response = await fetch(`/api/signature/${address}?name=${name}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get signature");
      }

      const signatureData = (await response.json()) as SignatureData;

      return signatureData;
    },
    enabled: enabled,
  });

  if (!data) return { address: "0x0", name: "", signature: "" };

  return { data, refetch };
}
