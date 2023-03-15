import { cnsABI } from "../constants/cnsABI";
import { createPublicClient, http } from "viem";
import { canto } from "viem/chains";
import { stringLength } from "../utils/stringLength";

const client = createPublicClient({
  chain: canto,
  transport: http("https://node-cantonameservice.xyz/"),
});

interface TokenMetadata {
  name: string;
  description: string;
  tokenId: string;
  image: string;
  attributes: Attribute[];
}

interface Attribute {
  trait_type: string;
  value: string;
}

export const MakeTokenMetadata = async ({ tokenId }: { tokenId: string }): Promise<TokenMetadata | null> => {
  const BigTokenId = BigInt(tokenId);

  const expiry = await client.readContract({
    abi: cnsABI,
    address: process.env.CNS_CONTRACT_ADDRESS,
    functionName: "expiry",
    args: [BigTokenId],
  });

  const name = await client.readContract({
    abi: cnsABI,
    address: process.env.CNS_CONTRACT_ADDRESS,
    functionName: "tokenToName",
    args: [BigTokenId],
  });

  if (!name) return null;

  const baseImageURL = process.env.API_BASE_URL;
  const imageURI = `${baseImageURL}/image/${tokenId}`;

  const attributes: Attribute[] = [
    {
      trait_type: "Registration Expiration",
      value: expiry.toString(),
    },
    {
      trait_type: "name",
      value: name,
    },
    {
      trait_type: "length",
      value: stringLength(name).toString(),
    },
  ];

  return {
    attributes: attributes,
    description: `${name}, a CNS name.`,
    image: imageURI,
    name: name,
    tokenId: tokenId,
  };
};
