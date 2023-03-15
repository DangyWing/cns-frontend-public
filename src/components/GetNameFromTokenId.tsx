import { cnsABI } from "../constants/cnsABI";
import { createPublicClient, http } from "viem";
import { canto } from "viem/chains";

const client = createPublicClient({
  chain: canto,
  transport: http("https://node-cantonameservice.xyz/"),
});

export const GetNameFromTokenId = async ({ tokenId }: { tokenId: string }) => {
  const BigTokenId = BigInt(tokenId);

  const name = await client.readContract({
    abi: cnsABI,
    address: process.env.CNS_CONTRACT_ADDRESS,
    functionName: "tokenToName",
    args: [BigTokenId],
  });

  if (!name) {
    return null;
  }

  return name;
};
