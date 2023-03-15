import { allowedAddresses } from "../constants/allowedAddresses";

export const isNameOnAllowlist = (name: string) => {
  return allowedAddresses.find((allowed) => {
    if (allowed.name === name) {
      return allowed;
    } else return false;
  });
};
