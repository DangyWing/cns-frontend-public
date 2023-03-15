import { useAccount } from "wagmi";
import Link from "next/link";

import { useIsMounted } from "../hooks/useIsMounted";
import { ReserveAllowlistButton } from "../components/ReserveAllowlist";
import { CurrentPrices } from "../components/CurrentPrices";
import { useCheckIfAllowlistClaimed } from "../hooks/useCheckIfAllowlistClaimed";
import { middleEllipsize } from "../utils/ellipsize";
import type { NextPage } from "next";
import { useGetSignatureForAddressAndName } from "../hooks/useGetSignatureForAddressAndName";
import { allowedAddresses } from "../constants/allowedAddresses";

const Reserved: NextPage = () => {
  const { isConnected, address } = useAccount();

  const isMounted = useIsMounted();

  const { data: allowlistClaimed } = useCheckIfAllowlistClaimed({
    address: address,
    enabled: !!address,
  });

  const allowedResult = allowedAddresses.find((allowedAddress) => {
    if (address === allowedAddress.address) {
      return { address: allowedAddress.address, name: allowedAddress.name };
    }
  });

  const allowedAddress = allowedResult?.address;
  const name = allowedResult?.name ?? "";

  const addressForSignature = allowedAddress ?? "0x0";

  const { data: signatureResult } = useGetSignatureForAddressAndName({
    address: addressForSignature,
    name: name,
    enabled: !!addressForSignature && !!name,
  });

  if (!isMounted) return null;

  if (!isConnected || !address) return <div className="mt-4 flex justify-center">Disconnected</div>;

  if (!allowedResult)
    return (
      <div className="mt-4 flex flex-col items-center justify-center">
        <div className="m-4">you are not on the allowlist</div>
        <Link
          key="home"
          href={"/"}
          className={
            "mt-12 w-16 border border-cantoGreenDark p-3 text-sm font-medium text-cantoGreenDark hover:bg-cantoGreenDarker hover:text-black"
          }
        >
          home
        </Link>
      </div>
    );

  const signature = signatureResult?.signature ?? "0x0";

  return (
    <div>
      {!allowlistClaimed && allowedResult && <h1 className="text-center text-2xl">reserve your name: {name}</h1>}
      <div className="m-2 mx-auto min-h-screen flex-col py-2 align-middle ">
        {!allowedResult && <div>not on the allowlist</div>}
        {allowlistClaimed && (
          <div className="m-2 flex flex-col items-center justify-center">
            {middleEllipsize(address)} has already claimed <span className="text-gray-300">&apos;{name}&apos;</span>
            <div className="m-2 flex justify-center p-2">
              <Link
                key="my account"
                href={address ? `/address/${address}` : "/"}
                className={
                  "border border-cantoGreenDark px-3 py-2 text-sm font-medium text-cantoGreenDark hover:bg-cantoGreenDarker hover:text-black"
                }
              >
                my account
              </Link>
            </div>
          </div>
        )}
        {allowedResult && !allowlistClaimed && signature != "0x0" && (
          <div className="m-2 flex items-center justify-center">
            <ReserveAllowlistButton name={name} active={true} signature={signature} />
          </div>
        )}
        {!allowlistClaimed && (
          <div className="flex items-center justify-center">
            <CurrentPrices type={"allowlist"} allowlistName={name} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reserved;
