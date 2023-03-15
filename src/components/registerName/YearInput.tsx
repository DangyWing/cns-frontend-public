import type { Path, UseFormRegister } from "react-hook-form";
import type { FormSchemaType } from "./RegisterNameForm";

type InputProps = {
  label: Path<FormSchemaType>;
  register: UseFormRegister<FormSchemaType>;
  required: boolean;
  className?: string;
  disabled: boolean;
  value: number;
};

export const YearInput = ({ label, register, required, className, disabled, value }: InputProps) => (
  <>
    <input
      value={value}
      type={"number"}
      {...register(label, { required, valueAsNumber: true })}
      className={className}
      disabled={disabled}
    />
  </>
);
