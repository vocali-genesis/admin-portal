import React from "react";
import form_style from "./input.module.css";
import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  type: string;
  placeholder: string;
  validation: object;
  icon?: string;
}

export function InputField<T extends FieldValues = FieldValues>({
  register,
  errors,
  name,
  type,
  placeholder,
  validation,
  icon,
}: InputFieldProps<T>) {
  return (
    <div className={form_style.formInput}>
      <input
        {...register(name, validation)}
        type={type}
        placeholder={placeholder}
        className={`${icon || ""} ${form_style.formControl} `}
      />
      {errors[name]?.message && (
        <span className={form_style.errorMessage}>{errors[name]?.message}</span>
      )}
    </div>
  );
}

export default InputField;
