import { ethers } from "ethers";
import type { Address } from "wagmi";

export function middleEllipsize(str: string | Address | undefined | null): string {
  if (str === undefined || !str || !ethers.utils.isAddress(str)) {
    return "";
  } else {
    return str.substring(0, 5) + "..." + str.substring(str.length - 5, str.length);
  }
}
