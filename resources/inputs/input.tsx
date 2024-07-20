import React from "react";
import { useTranslations } from "next-intl";
import form_style from "./styles/input.module.css";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
  confirm_password: string;
};
interface InputFieldProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  name: keyof FormData;
  type: string;
  placeholder: string;
  validation: object;
}

const InputField: React.FC<InputFieldProps> = ({
  register,
  errors,
  name,
  type,
  placeholder,
  validation,
}) => {
  const t = useTranslations("");

  return (
    <div className={form_style.formInput}>
      <input
        {...register(name, validation)}
        type={type}
        placeholder={t(placeholder)}
        className={`${form_style.formControl} ${form_style[`input${type.charAt(0).toUpperCase() + type.slice(1)}Icon`]}`}
      />
      {errors[name] && (
        <span className={form_style.errorMessage}>
          {t(errors[name]?.message)}
        </span>
      )}
    </div>
  );
};

interface AuthInputProps {
  register: any;
  errors: any;
  action: "register" | "login" | "confirm-reset-password" | "reset-password";
}

const inputConfig = {
  email: {
    type: "email",
    placeholder: "Email",
    validation: { required: "Email is required" },
  },
  password: {
    type: "password",
    placeholder: "Password",
    validation: { required: "Password is required" },
  },
  confirm_password: {
    type: "password",
    placeholder: "Confirm Password",
    validation: { required: "Confirm Password is required" },
  },
} as const;

type InputConfigKey = keyof typeof inputConfig;

const Input: React.FC<AuthInputProps> = ({ register, errors, action }) => {
  const fieldsToShow = {
    email: ["register", "login", "reset-password"].includes(action),
    password: ["register", "login", "confirm-reset-password"].includes(action),
    confirm_password: ["register", "confirm-reset-password"].includes(action),
  };

  return (
    <>
      {(
        Object.entries(inputConfig) as [
          InputConfigKey,
          (typeof inputConfig)[InputConfigKey],
        ][]
      ).map(
        ([name, config]) =>
          fieldsToShow[name] && (
            <InputField
              key={name}
              register={register}
              errors={errors}
              name={name}
              {...config}
            />
          ),
      )}
    </>
  );
};

export default Input;
