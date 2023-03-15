import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export const ShowPrimaryCNS = ({ primaryName }: { primaryName: string }) => {
  return (
    <div className="ml-0 border border-cantoGreenDark text-cantoGreen">
      <Disclosure defaultOpen={false}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between  p-2 ">
              <>
                primary cns name: {primaryName}
                <ChevronRightIcon
                  className={
                    open ? "h-6 w-6 rotate-90 transform text-cantoGreenDarker" : "h-6 w-6 text-cantoGreenDarker"
                  }
                />
              </>
            </Disclosure.Button>

            <Disclosure.Panel className="text-cantoGreenDark">
              <p className="mx-2 p-0 text-sm font-medium text-cantoGreen">
                * notes your primary name. one human readable aspect of your web+ identity.
              </p>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
