import { ethers } from "ethers";
import type { Address } from "wagmi";
import { allowedAddresses } from "../constants/allowedAddresses";

type SignedMessageResult = {
  type: "Reserved" | "Public";
  address: Address;
  signature: string;
  name: string;
};
type Error = {
  error: string;
};

export const signAddressAndNameWithPK = async ({
  address,
  name,
}: {
  address: Address;
  name: string;
}): Promise<SignedMessageResult | Error> => {
  const validReserved = allowedAddresses.find((allowedAddress) => {
    return allowedAddress.address === address && allowedAddress.name === name;
  });

  const names = allowedAddresses.map((allowedAddress) => allowedAddress.name);

  const validPublic = !names.includes(name);

  if (validReserved || validPublic) {
    const privateKey = process.env.CNS_SIGNER_PRIVATE_KEY;

    const wallet = new ethers.Wallet(privateKey);

    const messageHash = ethers.utils.solidityKeccak256(["address", "string"], [address, name]);

    const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));

    return {
      type: validReserved ? "Reserved" : "Public",
      address: address,
      signature: signature,
      name: name,
    };
  } else {
    return { error: `ERROR: ${name} reserved` };
  }
};
