import type { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import { signAddressAndNameWithPK } from "../../../utils/signAddressAndNameWithPk";
import { checkForValidName } from "../../../utils/checkForValidName";
import { allowedAddresses } from "../../../constants/allowedAddresses";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, name } = req.query;

  if (!address) return res.status(400).json({ error: "Missing address in request" });
  if (!name) return res.status(400).json({ error: "Missing name in request" });
  if (typeof name !== "string") return res.status(400).json({ error: "Invalid name in request" });
  if (typeof address !== "string") return res.status(400).json({ error: "Invalid address in request" });
  if (!utils.isAddress(address)) return res.status(400).json({ error: "Invalid address in request" });

  const nameOnAllowlist = allowedAddresses.find((allowed) => {
    if (allowed.name.toLowerCase() === name.toLowerCase()) {
      return allowed;
    } else return false;
  });

  const { name: validatedName, error: nameValidationError } = checkForValidName({ name: name });

  if (nameValidationError || !validatedName) return res.status(400).json({ error: nameValidationError });

  // the only case when the name is on the allowlist and it should be signed is if
  // the address matches the name on the allowlist

  if (nameOnAllowlist && nameOnAllowlist.address != address)
    return res.status(400).json({ error: "Address not on allowlist for this name" });

  const sigResult = await signAddressAndNameWithPK({ address: address, name: name });

  if ("error" in sigResult) return res.status(400).json({ error: sigResult.error });

  const { signature, address: returnedAddress, name: returnedName } = sigResult;

  res.setHeader("Content-Type", "application/json");

  res.send({
    address: returnedAddress,
    name: returnedName,
    signature: signature,
  });
}
