import type { Path, UseFormRegister } from "react-hook-form";
import type { FormSchemaType } from "./RegisterNameForm";

type InputProps = {
  label: Path<FormSchemaType>;
  register: UseFormRegister<FormSchemaType>;
  required: boolean;
  className?: string;
  disabled: boolean;
};

export const NameInput = ({ label, register, required, className, disabled }: InputProps) => (
  <>
    <input {...register(label, { required })} className={className} disabled={disabled} />
  </>
);
