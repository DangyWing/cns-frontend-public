import { useEffect, useState } from "react";
import { inputClasses } from "../../styles/inputClasses";
import type { Address } from "wagmi";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { useDebounce } from "use-debounce";
import { utils } from "ethers";
import { classNames } from "../../utils/classNames";
import { LoadingIndicator } from "../LoadingIndicator";
import { customBoxShadow } from "../../styles/customBoxShadow";
import { AddressComboBox } from "../AddressCombobox";
import { useCNSLookup } from "../../hooks/useCNSLookup";

const defaultClass =
  "cursor-pointer border border-cantoGreenDark py-2 my-2 px-4 hover:bg-cantoGreen hover:text-gray-600 hover:fill-cantoGreen hover:duration-200 cursor-pointer";
const activeClass = "bg-cantoGreenDark text-black cursor-pointer";
const inactiveClass = "text-gray-200 hover:bg-cantoGreenDarker cursor-not-allowed";

export const SendCanto = () => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const [debouncedTo] = useDebounce(selectedAddress ?? "", 333);
  const [debouncedName] = useDebounce(name, 666);
  const addresses = useCNSLookup({ name: debouncedName });
  const [debouncedAmount] = useDebounce(amount, 666);
  const [addressErrors, setAddressErrors] = useState<string>();
  const [amountErrors, setAmountErrors] = useState<string>();

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
    enabled: !!selectedAddress && !!debouncedAmount && utils.isAddress(debouncedTo),
  });

  const { sendTransaction, data } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
  });

  useEffect(() => {
    if (debouncedName === "") {
      setAddressErrors("no entry found");
    } else if (!debouncedName) {
      setAddressErrors("please enter a valid .canto address");
    } else if (!addresses) {
      setAddressErrors(`'${debouncedName}' not found`);
    } else if (!debouncedTo) {
      setAddressErrors("please select an address");
    } else if (debouncedTo) {
      setAddressErrors(undefined);
    }
  }, [setAddressErrors, name, selectedAddress, addresses, debouncedName, debouncedTo]);

  useEffect(() => {
    if (addressErrors) {
      setAmountErrors("");
    } else if (amount === "") {
      setAmountErrors("please enter an amount of canto");
    } else if (amount && amount != "0" && amount != "") {
      setAmountErrors(undefined);
    }
  }, [amount, setAmountErrors, addressErrors]);

  return (
    <>
      <div className={customBoxShadow}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendTransaction?.();
          }}
        >
          <div>
            <div className="max-w-48 flex flex-row items-center">
              <div className="px-2">send</div>
              <input
                type="number"
                className={inputClasses.concat("w-24")}
                aria-label="Amount (ether)"
                onChange={(e) => setAmount(e.target.value)}
                placeholder="66"
                value={amount}
              />
              <div className="pl-2 text-center">canto to</div>
              <input
                className={inputClasses}
                type="text"
                placeholder="<name>"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <div className="pr-2 pl-0">.canto</div>
            </div>
            <div className="flex justify-center p-2">
              <AddressComboBox
                addresses={addresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            </div>
            <div className="mr-0 flex justify-center">
              {isLoading && <LoadingIndicator />}
              {addressErrors && !isLoading && <div className="text-center text-cantoError">- {addressErrors} -</div>}
              {amountErrors && !isLoading && <div className="text-center text-cantoError">- {amountErrors} -</div>}
              {!addressErrors && !amountErrors && !isLoading && (
                <button className={classNames(sendTransaction ? activeClass : inactiveClass, defaultClass)}>
                  {"---->"}
                </button>
              )}
            </div>
          </div>
          {isSuccess && (
            <div>
              successfully sent {amount} canto to {name}
              <div>
                <a href={`https://evm.explorer.canto.io/tx/${data?.hash ?? ""}`}>view on canto explorer</a>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
