import { Button } from "./Buttons/Button";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { Modal } from "./Modal";
import { useState } from "react";
import { middleEllipsize } from "../utils/ellipsize";
import { useEffect } from "react";
import { canto } from "wagmi/chains";
import { primaryNameAtom } from "../atoms";
import { useAtomValue } from "jotai";
import { useGetPrimaryNameFromAddress } from "../hooks/useGetPrimaryNameFromAddress";

const defaultClass =
  "border border-cantoGreenDark bg-black px-6 py-1 lowercase text-cantoGreenDark hover:bg-cantoGreen hover:text-black";

export function ConnectButton() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
    chainId: canto.id,
  });

  const { address, isConnected } = useAccount();
  const [_isConnected, _setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const primaryName = useAtomValue(primaryNameAtom);

  const displayNameFromAtom = primaryName ? primaryName.concat(".canto") : middleEllipsize(address);

  useGetPrimaryNameFromAddress(address);

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  const { disconnect } = useDisconnect();

  const IsConnected = () => {
    return (
      <div>
        <div className="my-2 flex flex-col justify-center">
          <Button
            text={`disconnect ${displayNameFromAtom}`}
            important={true}
            disabled={false}
            type="button"
            onClick={() => disconnect()}
          />
        </div>
      </div>
    );
  };

  const Connectors = () => {
    return (
      <div className="flex flex-col space-y-2">
        {connectors.map((connector) => (
          <button
            className={defaultClass}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading && connector.id === pendingConnector?.id && "(connecting)"}
          </button>
        ))}

        {error && <div>{error.message}</div>}
      </div>
    );
  };

  return (
    <div>
      <Button
        text={_isConnected ? displayNameFromAtom : "Connect Wallet"}
        type="button"
        disabled={isLoading}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} label={middleEllipsize(address)}>
        {_isConnected ? <IsConnected /> : <Connectors />}
      </Modal>
    </div>
  );
}
