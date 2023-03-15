import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/24/outline";

const defaultClass =
  "mx-1 h-7 w-7 transform text-cantoGreen transition ease-in-out hover:scale-110 hover:text-gray-800 hover:background hover:bg-cantoGreen hover:duration-500 cursor-pointer";

const activeClass = "bg-cantoGreenDark text-black";

export const SendTxButtonConfirm = ({ onClick, active }: { onClick?: () => void; active?: boolean }) => {
  return (
    <>
      <CheckIcon className={clsx(defaultClass, active && activeClass)} onClick={onClick} />
    </>
  );
};
