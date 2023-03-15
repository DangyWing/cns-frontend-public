import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import clsx from "clsx";
import { useGetNamePrice } from "../hooks/useGetNamePrice";
import { BigNumber } from "ethers";
import { cnsABI } from "../constants/cnsABI";
import { LoadingIndicator } from "./LoadingIndicator";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { multiplyBigNumber } from "../utils/multipleBigNumberByFloat";
import { stringLength } from "../utils/stringLength";

const defaultClass =
  "mx-1 h-7 w-7 transform transition ease-in-out hover:scale-110 hover:fill-cantoGreen hover:duration-500 cursor-pointer hover:text-gray-800";

const contractAddress = process.env.CNS_CONTRACT_ADDRESS;

export const ReserveAllowlistButton = ({
  name,
  active,
  signature,
}: {
  name: string;
  active: boolean;
  signature: `0x${string}`;
}) => {
  const { data: price } = useGetNamePrice(BigNumber.from(stringLength(name)));
  const adjustedPrice = multiplyBigNumber(price, 1.12).div(2);

  const overrides = {
    value: adjustedPrice,
  };

  const { config, isSuccess: isPrepareSuccess } = usePrepareContractWrite({
    address: contractAddress,
    abi: cnsABI,
    functionName: "registerNameOnAllowlist",
    overrides: overrides,
    enabled: !!signature && !!name,
    args: [name, signature],
  });

  const { write, data, isLoading } = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  const { isSuccess, isFetching, isFetched } = waitForTransaction;

  const tweetHref = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.cantonameservice.xyz&via=DNSFORCANTO&text=I%20reserved%20${name}%20on%20Canto%20Name%20Service`;

  const loadingOrFetching = isLoading || isFetching;

  return (
    <div>
      <div className="items-center">
        {isSuccess && !!data?.hash && (
          <div className="py-2 text-white">
            tx successfully sent | <a href={`https://evm.explorer.canto.io/tx/${data.hash}`}>view on canto explorer</a>
          </div>
        )}
        {loadingOrFetching && <LoadingIndicator />}
        {!isFetching && !isSuccess && !isLoading && (
          <button
            className="m-3 flex items-center border border-cantoGreenDark p-4 hover:bg-cantoGreenDark hover:text-gray-900"
            disabled={!isPrepareSuccess || !write}
            onClick={() => write?.()}
          >
            reserve: {name}
            <PaperAirplaneIcon className={clsx(defaultClass, active)} />
          </button>
        )}
        {isFetched && isSuccess && (
          <div className="flex justify-center">
            <div className="m-2 w-1/2 bg-cantoGreenDark  p-2 text-center text-gray-800">
              <Link key="tweetAboutIt" href={tweetHref} target={"_blank"}>
                <FontAwesomeIcon icon={faTwitter} />
                tweet about it
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
