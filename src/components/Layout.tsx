import React, { Fragment } from "react";
import { Header } from "./Header";
import { useCheckMintStatus } from "../hooks/useCheckMintStatus";
type Props = {
  children?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const { mintStatus } = useCheckMintStatus();

  return (
    <>
      {mintStatus === "1" && <Header />}
      <div className="flex flex-col md:px-4">{children}</div>
    </>
  );
};
