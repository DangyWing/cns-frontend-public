import { CurrentPrices } from "../components/CurrentPrices";
import type { NextPage } from "next";

const About: NextPage = () => {
  return (
    <>
      <div className="flex-row items-center justify-center text-center">
        <h2 className=" m-2">we are canto name service</h2>
        <br />
        <p>
          what makes us <span className="text-gray-200">different?</span>
        </p>
        <p>.</p>
        <p>
          we use{" "}
          <a className="text-gray-200 underline" href="https://www.paradigm.xyz/2022/08/vrgda">
            vrgdas
          </a>{" "}
          to price names based upon market interest.
        </p>
        <p>.</p>
        <p>
          if someone buys a <span className="text-gray-200">4</span> character name, the price of{" "}
          <span className="text-gray-200">4</span> character names will increase.
        </p>
        <p>.</p>
        <p>
          while no one buys a <span className="text-gray-200">4</span> character name the price will decrease.
        </p>
        <p>-------</p>
        <div className="flex justify-center">
          <CurrentPrices />
        </div>
      </div>
    </>
  );
};

export default About;
