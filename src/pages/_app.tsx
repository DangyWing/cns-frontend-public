// src/pages/_app.tsx
import "../styles/globals.css";
import "../styles/fonts.css";
import type { AppType } from "next/app";
import { canto } from "wagmi/chains";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { InjectedConnector } from "@wagmi/core";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "../components/Layout";
// import type { Chain } from "wagmi";

const queryClient = new QueryClient();

// export const LocalAnvil: Chain = {
//   id: 31337,
//   name: "Local Anvil",
//   network: "local anvil",
//   rpcUrls: { default: { http: ["http://127.0.0.1:8545"] }, public: { http: ["http://127.0.0.1:8545"] } },
//   nativeCurrency: {
//     name: "Eth",
//     symbol: "ETH",
//     decimals: 18,
//   },
//   testnet: true,
// };

const { chains, provider } = configureChains(
  // [LocalAnvil],
  [canto],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `https://node-cantonameservice.xyz/`,
      }),
      stallTimeout: 500,
      priority: 1,
      weight: 4,
    }),
    publicProvider({
      priority: 2,
      weight: 4,
    }),
    jsonRpcProvider({
      rpc: () => ({
        http: `https://jsonrpc.canto.nodestake.top`,
      }),
      stallTimeout: 500,
      priority: 3,
      weight: 2,
    }),
    jsonRpcProvider({
      rpc: () => ({
        http: `https://canto.neobase.one`,
      }),
      stallTimeout: 500,
      priority: 3,
      weight: 3,
    }),
    jsonRpcProvider({
      rpc: () => ({
        http: `https://canto.gravitychain.io/`,
      }),
      stallTimeout: 500,
      priority: 3,
      weight: 1,
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  persister: null,
  connectors: [
    new MetaMaskConnector({
      chains: [canto],
    }),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <JotaiProvider>
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <div className="staticNoiseOverlay" />
          <div className="scanlinesOverlay" />
          <div className="scanLine" />
          <div className="overlay" />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </WagmiConfig>
    </JotaiProvider>
  );
};

export default MyApp;
