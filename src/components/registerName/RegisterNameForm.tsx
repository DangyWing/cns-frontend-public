import type { SendTransactionResult } from "@wagmi/core";
import type { SubmitHandler } from "react-hook-form";
import { atom, useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BigNumber } from "ethers";

import { Button } from "../Buttons/Button";
import { checkForValidName } from "../../utils/checkForValidName";
import { formatPrice } from "../../utils/formatPrice";
import { isNameOnAllowlist } from "../../utils/isNameOnAllowlist";
import { inputClasses } from "../../styles/inputClasses";
import { LoadingIndicator } from "../LoadingIndicator";
import { NameInput } from "./NameInput";
import { nameToTokenId } from "../../utils/nameToTokenId";
import { namePriceAtom } from "../CurrentPrices";
import { useAccount } from "wagmi";
import { useDebounce } from "../../hooks/useDebounce";
import { useFindOwnerOfName } from "../../hooks/useFindOwnerOfName";
import { useGetSignatureForAddressAndName } from "../../hooks/useGetSignatureForAddressAndName";
import { useRegisterName } from "../../hooks/useRegisterName";
import { YearInput } from "./YearInput";

const FormSchema = z.object({
  nameToRegister: z.string().min(1, "name must be at least 1 character"),
  yearsToRegister: z.number({
    invalid_type_error: "please enter a number",
  }),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

export const nameToRegisterAtom = atom<string>("");

export const RegisterNameForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nameToRegister: "",
      yearsToRegister: 1,
    },
  });

  const userNameInput = watch("nameToRegister");
  const userYearInput = watch("yearsToRegister");
  const [validatedName, setValidatedName] = useState<string | undefined>(undefined);
  const debouncedName = useDebounce<string | undefined>(validatedName, 500);
  const [years, setYears] = useState(1);
  const [, setNameToRegister] = useAtom(nameToRegisterAtom);
  const { address } = useAccount();
  const tokenId = nameToTokenId(debouncedName);

  const { data: nameOwner } = useFindOwnerOfName({
    tokenId: tokenId ?? BigNumber.from(0),
    enabled: tokenId != BigNumber.from(0) && !!debouncedName && !!validatedName,
  });

  useEffect(() => {
    setNameToRegister(userNameInput);
  }, [userNameInput, setNameToRegister]);

  useEffect(() => {
    const { name, error } = checkForValidName({ name: userNameInput });
    if (name) {
      setValidatedName(name);
    }

    if (error) {
      setError("nameToRegister", {
        type: "manual",
        message: error,
      });
    } else if (!name || !debouncedName) {
      setError("nameToRegister", {
        type: "manual",
        message: "no name entered",
      });
    } else if (nameOwner) {
      setError("nameToRegister", {
        type: "manual",
        message: `'${debouncedName}' already taken`,
      });
    } else if (isNameOnAllowlist(name)) {
      setError("nameToRegister", {
        type: "manual",
        message: `'${name}' is reserved`,
      });
    } else {
      clearErrors("nameToRegister");
      clearErrors("yearsToRegister");
    }
  }, [userNameInput, setError, validatedName, debouncedName, clearErrors, nameOwner]);

  useEffect(() => {
    if (userYearInput < 1) {
      setError("yearsToRegister", {
        type: "manual",
        message: `you must register for at least 1 year`,
      });
    } else {
      clearErrors("yearsToRegister");
    }
  }, [nameOwner, setError, userYearInput, clearErrors]);

  useEffect(() => {
    if (!userYearInput || userYearInput < 1) {
      setYears(1);
    } else {
      setYears(userYearInput);
    }
  }, [userYearInput]);

  const [namePrice] = useAtom(namePriceAtom);

  const { data: sigData } = useGetSignatureForAddressAndName({
    address: address ?? "0x0",
    name: debouncedName ?? "",
    enabled: !!address && !!validatedName && !!debouncedName,
  });

  const signature = sigData?.signature;
  const name = sigData?.name;

  const { data, isLoading, writeAsync, isSuccess, isFetching } = useRegisterName({
    name: name ?? "",
    yearsToRegister: BigNumber.from(years),
    signature: signature ?? "0x0",
    enabled: !errors.nameToRegister && !errors.yearsToRegister && !!name && !!signature && !nameOwner,
  });

  useEffect(() => {
    if (isSuccess) {
      resetField("nameToRegister");
    }
  }, [isSuccess, resetField]);

  const onSubmit: SubmitHandler<FormSchemaType> = async (): Promise<SendTransactionResult | undefined> => {
    if (!writeAsync) return;
    try {
      await writeAsync();
    } catch (error) {}
    return;
  };

  return (
    <div className="min-w-48">
      <form
        className="width-48 flex w-full flex-col py-4 px-6 "
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      >
        {namePrice && !errors.nameToRegister && (
          <h1 className="mx-2 my-1">
            &apos;{validatedName}&apos; costs {formatPrice(namePrice)} canto per year
            {years > 1 && " or "}
            {years > 1 && formatPrice(namePrice.mul(years))}
          </h1>
        )}
        {errors.nameToRegister ? (
          <span className="mx-2 my-1 text-center text-cantoError">- {errors.nameToRegister.message} -</span>
        ) : null}
        <NameInput
          label="nameToRegister"
          register={register}
          required
          className={inputClasses}
          disabled={isSubmitting}
        />
        <p className="pl-2">years to register:</p>
        <YearInput
          label="yearsToRegister"
          register={register}
          required
          className={inputClasses}
          disabled={isSubmitting}
          value={years}
        />
        {errors.yearsToRegister && (
          <span className="mx-2 my-1 text-cantoError">- {errors.yearsToRegister.message} -</span>
        )}
        {(isSubmitting || isLoading || isFetching) && <LoadingIndicator />}
        <div className="m-2 flex justify-center">
          <Button text="submit" type="submit" disabled={isSubmitting || !writeAsync || isFetching} />
        </div>
        {isSuccess && !!data?.hash && (
          <div className="mt-4 text-white">
            tx successfully sent | <a href={`https://evm.explorer.canto.io/tx/${data.hash}`}>view on canto explorer</a>
          </div>
        )}
      </form>
    </div>
  );
};
