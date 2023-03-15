import { TrashIcon } from "@heroicons/react/24/outline";

import clsx from "clsx";

const defaultClass =
  "mx-1 h-7 w-7 transform text-cantoGreen transition ease-in-out hover:scale-110 hover:fill-cantoGreen hover:duration-500 cursor-pointer";

const activeClass = "bg-cantoGreenDark text-black";

export const TrashButton = ({ onClick, active }: { onClick?: () => void; active?: boolean }) => {
  return (
    <>
      <TrashIcon className={clsx(defaultClass, active && activeClass)} onClick={onClick} />
    </>
  );
};
