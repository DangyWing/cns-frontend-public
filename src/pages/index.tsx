import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { useAccount } from "wagmi";

import { ConnectButton } from "../components/ConnectButton";
import { CurrentPrices } from "../components/CurrentPrices";
import { NameChecker } from "../components/NameChecker";
import { RegisterNameForm } from "../components/registerName/RegisterNameForm";
import { TitleTyping } from "../components/TitleTyping";
import { useCheckMintStatus } from "../hooks/useCheckMintStatus";
import { useCheckIfAllowlisted } from "../hooks/useCheckIfAllowlisted";
import { useCheckIfAllowlistClaimed } from "../hooks/useCheckIfAllowlistClaimed";
import { useIsMounted } from "../hooks/useIsMounted";

const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const isMounted = useIsMounted();
  const { mintStatus, isLoading } = useCheckMintStatus();
  const isAllowlisted = useCheckIfAllowlisted({ address: address });

  const { data: allowlistClaimed, isLoading: isLoadingCheckIfAllowlistClaimed } = useCheckIfAllowlistClaimed({
    address: address,
    enabled: !!address && !!isAllowlisted.address,
  });

  if (!isMounted) return null;

  if (isLoading || isLoadingCheckIfAllowlistClaimed) return <div>loading...</div>;

  if (mintStatus != "1")
    return (
      <div className="mt-10 justify-center">
        <Marquee gradient={false} speed={66} className="flex flex-col align-bottom">
          cns status: closed
        </Marquee>
        <div className="mt-12">
          <div className="flex flex-col items-center justify-center">
            <NameChecker />
          </div>
        </div>
      </div>
    );

  return (
    <>
      <Head>
        <title>Canto Name Service</title>
        <meta name="description" content="canto name service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="md:width-48 container mx-auto flex flex-col items-center justify-center p-4">
        <TitleTyping />

        {isConnected && address && isAllowlisted.address && !allowlistClaimed && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-cantoGreenDark">!!you have a reserved name!!</p>
            <div className="my-4">
              {"--> "}
              <Link
                key="reserved"
                href={"/reserved"}
                aria-current="page"
                className={
                  "border px-4 py-2 text-sm font-medium text-gray-300 hover:border-cantoGreenDarker hover:bg-cantoGreenDarker hover:text-black"
                }
              >
                reserve
              </Link>
              {" <--"}
            </div>
          </div>
        )}
        {isConnected && address && mintStatus == "1" && (
          <div className="flex flex-col items-center justify-center">
            <RegisterNameForm />
            <CurrentPrices />
          </div>
        )}
        {!isConnected && <ConnectButton />}
      </main>
    </>
  );
};

export default Home;
