import { utils } from "ethers";
import type { BigNumber } from "ethers";

// todo: allow passing locale

export function formatPrice(price: BigNumber): string {
  if (!price) return "0.00";

  const num = Math.ceil(parseFloat(utils.formatEther(price)) * 100) / 100;

  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
