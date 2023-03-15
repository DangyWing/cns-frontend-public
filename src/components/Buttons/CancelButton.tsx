import clsx from "clsx";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

const defaultClass =
  "mx-1 h-7 w-7 transform text-cantoGreen transition ease-in-out hover:scale-110 hover:text-gray-800 hover:background hover:bg-cantoGreen hover:duration-500";

const activeClass = "bg-cantoGreenDark text-black";

const disabledClass =
  "cursor-default text-gray-600 hover:background hover:bg-gray-600 hover:duration: 300 hover:scale-100";
const notDisabledClass = "cursor-pointer";

export const CancelButton = ({
  onClick,
  active,
  disabled,
}: {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) => {
  return (
    <>
      <NoSymbolIcon
        className={clsx(disabled ? disabledClass : notDisabledClass, defaultClass, active && activeClass)}
        onClick={onClick}
      />
    </>
  );
};
