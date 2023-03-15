import type { NextPage } from "next";
import { SendCanto } from "../components/Inputs/SendCanto";

export const Tools: NextPage = () => {
  return (
    <>
      <div className="my-4 flex justify-center">
        <h1 className="justify-content flex">send some canto with just a cns</h1>
      </div>
      <div className="flex justify-center">
        <SendCanto />
      </div>
    </>
  );
};

export default Tools;
