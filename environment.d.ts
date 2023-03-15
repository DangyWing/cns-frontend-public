import type { Address } from "wagmi";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CNS_CONTRACT_ADDRESS: Address;
      CNS_SIGNER_PRIVATE_KEY: string;
      API_BASE_URL: `https://${string}`;
    }
  }
}

export {};
