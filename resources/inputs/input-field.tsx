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
}

export function InputField<T extends FieldValues = FieldValues>({
  register,
  errors,
  name,
  type,
  placeholder,
  validation,
}: InputFieldProps<T>) {
  return (
    <div className={form_style.formInput}>
      <input
        {...register(name, validation)}
        type={type}
        placeholder={placeholder}
        className={`${form_style.formControl} ${
          form_style[`input${type.charAt(0).toUpperCase() + type.slice(1)}Icon`]
        }`}
      />
      {errors[name]?.message && (
        <span className={form_style.errorMessage}>{errors[name]?.message}</span>
      )}
    </div>
  );
}

export default InputField;
