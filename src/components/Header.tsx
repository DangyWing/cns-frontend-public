import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { useAccount } from "wagmi";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "./ConnectButton";
import { classNames } from "../utils/classNames";

export const Header = () => {
  const { address } = useAccount();
  const router = useRouter();
  const [_address, _setAddress] = useState("");

  useEffect(() => {
    _setAddress(address ?? "");
  }, [address]);

  const headerNotRouteClasses = "text-gray-300 hover:bg-cantoGreenDark hover:text-black";
  const headerRouteClasses = "border border-cantoGreen text-cantoGreen ";
  const headerBaseClasses = "px-2 py-2 sm:max-h-10 text-sm font-medium  hover:border-cantoGreenDark";

  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto px-2 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 sm:justify-start">
            <div className="">
              <div className="flex space-x-2">
                <Link
                  key="home"
                  href="/"
                  className={classNames(
                    router.route === "/" ? headerRouteClasses : headerNotRouteClasses,
                    headerBaseClasses
                  )}
                >
                  home
                </Link>
                <Link
                  key="reserved"
                  href={"/reserved"}
                  aria-current="page"
                  className={classNames(
                    router.route === "/reserved" ? headerRouteClasses : headerNotRouteClasses,
                    headerBaseClasses
                  )}
                >
                  reserved
                </Link>
                <Link
                  key="my account"
                  href={_address ? `/address/${_address}` : "/"}
                  aria-current="page"
                  className={classNames(
                    router.route === `/address/[walletAddress]` ? headerRouteClasses : headerNotRouteClasses,
                    headerBaseClasses
                  )}
                >
                  my account
                </Link>
                <Link
                  key="tools"
                  href={"/tools"}
                  aria-current="page"
                  className={classNames(
                    router.route === "/tools" ? headerRouteClasses : headerNotRouteClasses,
                    headerBaseClasses
                  )}
                >
                  tools
                </Link>
                <a
                  key="Name Explorer"
                  aria-current="page"
                  className="
                    cursor-not-allowed px-2 py-2 text-sm font-medium text-gray-500 hover:bg-cantoGreenDarker hover:text-black"
                  onClick={() => {
                    false;
                  }}
                >
                  name explorer (soon)
                </a>
              </div>
            </div>
          </div>
          <Link key="twitter" href={"https://twitter.com/DNSFORCANTO"} target="_blank" className="px-2">
            <FontAwesomeIcon icon={faTwitter} />
          </Link>
          {router.route !== "/about" && (
            <div className="px-2 pr-4">
              <Link key="about" href="/about">
                ?
              </Link>
            </div>
          )}
          <ConnectButton />
        </div>
      </div>
    </Disclosure>
  );
};
