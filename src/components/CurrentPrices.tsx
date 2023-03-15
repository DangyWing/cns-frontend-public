import { useGetAllNamePrices } from "../hooks/useGetAllNamePrices";
import type { BigNumber } from "ethers";
import { atom, useAtom } from "jotai";
import { nameToRegisterAtom } from "./registerName/RegisterNameForm";
import { useEffect } from "react";
import { usePreviousPrice } from "../hooks/usePreviousPrice";
import { formatPrice } from "../utils/formatPrice";
import { customBoxShadow } from "../styles/customBoxShadow";
import { stringLength } from "../utils/stringLength";

export const namePriceAtom = atom<BigNumber | undefined>(undefined);

export const CurrentPrices = ({ type, allowlistName }: { type?: "allowlist" | "public"; allowlistName?: string }) => {
  const { data: allNamePrices, isSuccess } = useGetAllNamePrices();
  const [nameToRegister, setNameToRegister] = useAtom(nameToRegisterAtom);
  const [, setNamePrice] = useAtom(namePriceAtom);

  const currentLength = allowlistName?.length ?? stringLength(nameToRegister);

  const cleanPrices = allNamePrices.map((price) => {
    if (type === "allowlist") return formatPrice(price.div(2));
    return formatPrice(price);
  });

  const [cleanPriceOne, cleanPriceTwo, cleanPriceThree, cleanPriceFour, cleanPriceFive, cleanPriceSix] = cleanPrices;

  const prevPriceOne = usePreviousPrice(cleanPriceOne);
  const prevPriceTwo = usePreviousPrice(cleanPriceTwo);
  const prevPriceThree = usePreviousPrice(cleanPriceThree);
  const prevPriceFour = usePreviousPrice(cleanPriceFour);
  const prevPriceFive = usePreviousPrice(cleanPriceFive);
  const prevPriceSix = usePreviousPrice(cleanPriceSix);

  useEffect(() => {
    if (type === "allowlist") {
      setNameToRegister("");
    }
  }, [type, setNameToRegister]);

  useEffect(() => {
    if (!isSuccess) return;
    switch (true) {
      case currentLength === 1:
        setNamePrice(allNamePrices[0]);
        break;
      case currentLength === 2:
        setNamePrice(allNamePrices[1]);
        break;
      case currentLength === 3:
        setNamePrice(allNamePrices[2]);
        break;
      case currentLength === 4:
        setNamePrice(allNamePrices[3]);
        break;
      case currentLength === 5:
        setNamePrice(allNamePrices[4]);
        break;
      case currentLength > 5:
        setNamePrice(allNamePrices[5]);
        break;
      default:
        setNamePrice(undefined);
    }
  }, [allNamePrices, currentLength, isSuccess, setNamePrice, type]);

  const activePriceClass = "bg-cantoGreenDark text-black";

  const DisplayPriceTrend = ({ price, prevPrice }: { price: string | undefined; prevPrice: string | undefined }) => {
    const diff = Number(price) - Number(prevPrice);
    if (diff === 0) {
      return <div className="mx-1 text-cantoGreenDarker">-</div>;
    } else if (diff > 0) {
      return <div className="mx-1 text-cantoGreenDarker">^</div>;
    } else {
      return <div className="mx-1 rotate-180 text-cantoGreenDarker">^</div>;
    }
  };

  if (!isSuccess) return <div className="text-center">loading...</div>;

  return (
    <div className={customBoxShadow}>
      <table className="m-0 p-2 text-center">
        <thead>
          <tr className="m-2 p-2">
            <th className="m-2 p-2">
              <h1>name</h1>
              <h1>length</h1>
            </th>
            <th className="m-2 p-2">
              <h1>price</h1>
              <h1>(in canto)</h1>
            </th>
            <th className="pr-8"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="text-cantoGreenDarker">----</span>
            </td>
            <td>
              <span className="text-cantoGreenDarker">----</span>
            </td>
            <td></td>
          </tr>
          <tr className={currentLength === 1 ? activePriceClass : ""}>
            <td>1</td>
            <td className="">{cleanPriceOne}</td>
            <td>
              <DisplayPriceTrend price={cleanPriceOne} prevPrice={prevPriceOne} />
            </td>
          </tr>
          <tr className={currentLength === 2 ? activePriceClass : ""}>
            <td>2</td>
            <td className="">{cleanPriceTwo}</td>
            <td>
              <DisplayPriceTrend price={cleanPriceTwo} prevPrice={prevPriceTwo} />
            </td>
          </tr>
          <tr className={currentLength === 3 ? activePriceClass : ""}>
            <td>3</td>
            <td className="">{cleanPriceThree}</td>
            <td>
              <DisplayPriceTrend price={cleanPriceThree} prevPrice={prevPriceThree} />
            </td>
          </tr>
          <tr className={currentLength === 4 ? activePriceClass : ""}>
            <td>4</td>
            <td className="">{cleanPriceFour}</td>
            <td>
              <DisplayPriceTrend price={cleanPriceFour} prevPrice={prevPriceFour} />{" "}
            </td>
          </tr>
          <tr className={currentLength === 5 ? activePriceClass : ""}>
            <td>5</td>
            <td className="">{cleanPriceFive}</td>
            <td>
              <DisplayPriceTrend price={cleanPriceFive} prevPrice={prevPriceFive} />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <p className="px-2 text-cantoGreenDark">
                - VRGDAs take all previously minted names for a given name length into account -
              </p>
              <p className="px-2 text-cantoGreenDark">- we adjusted the daily target from 100 to 10 for 6+ names -</p>
              <p className=" px-2 text-cantoGreenDark">- this led to an extremely increased price for 6+ names -</p>
              <p className="px-2 text-cantoGreenDark">- the price will normalize back to ~10 canto shortly -</p>
            </td>
          </tr>
          <tr className={currentLength >= 6 ? activePriceClass : ""}>
            <td>6+</td>
            <td className="">{cleanPriceSix}</td>
            <td>
              <DisplayPriceTrend price={cleanPriceSix} prevPrice={prevPriceSix} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
