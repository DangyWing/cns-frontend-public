import React from "react";
import { useAccount } from "wagmi";
import { ShowWalletDetails } from "../../components/ShowWalletDetails";
import { useIsMounted } from "../../hooks/useIsMounted";
import { ConnectButton } from "../../components/ConnectButton";

import type { NextPage } from "next";

const WalletAddress: NextPage = () => {
  const isMounted = useIsMounted();

  const { address, isConnected } = useAccount();
  if (!isMounted) return null;

  return (
    <>
      {isConnected && address ? (
        <ShowWalletDetails walletAddress={address} />
      ) : (
        <main className="container mx-auto mt-12 flex min-h-screen flex-col items-center p-4">
          <ConnectButton />
        </main>
      )}
    </>
  );
};

export default WalletAddress;
