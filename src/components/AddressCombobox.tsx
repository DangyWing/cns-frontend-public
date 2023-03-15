import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import type { Address } from "wagmi";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { middleEllipsize } from "../utils/ellipsize";
import { classNames } from "../utils/classNames";

export const comboboxInputClasses =
  "p-2 rounded-none bg-gray-800 relative w-full placeholder-gray-500 focus:outline-none sm:text-sm text-white text-center";

export const AddressComboBox = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
}: {
  addresses: Address[] | undefined;
  selectedAddress: Address | undefined;
  setSelectedAddress: (address: Address) => void;
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!addresses) return;
    if (addresses.length === 1) {
      const addressToSet = addresses[0];
      if (!addressToSet) return;
      setSelectedAddress(addressToSet);
    }
  }, [addresses, setSelectedAddress]);

  if (!addresses) return null;

  const filteredAddresses =
    query === ""
      ? addresses
      : addresses?.filter((address) => {
          return address.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selectedAddress} onChange={setSelectedAddress}>
      <Combobox.Label>pick an address:</Combobox.Label>
      <div className="relative mt-1 w-full cursor-default overflow-hidden bg-gray-500">
        <Combobox.Input
          className={comboboxInputClasses}
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => middleEllipsize(selectedAddress)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0">
          <ChevronDownIcon className="h-5 w-5 text-cantoGreen" aria-hidden="true" />
        </Combobox.Button>
      </div>
      <Combobox.Options className={"border border-gray-200"}>
        {filteredAddresses.map((address) => (
          <Combobox.Option
            key={address}
            value={address}
            className={({ active }) =>
              classNames(
                "relative cursor-default select-none py-2 px-4",
                active ? "bg-cantoGreenDark text-gray-800" : "text-cantoGreenDark"
              )
            }
          >
            {({ active, selected }) => (
              <>
                <span className="pl-4">{middleEllipsize(address)}</span>
                {selected && (
                  <span
                    className={classNames(
                      "absolute inset-y-0 left-0 flex items-center pl-4",
                      active ? "text-gray-800" : "text-cantoGreen"
                    )}
                  >
                    *
                  </span>
                )}
              </>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};
