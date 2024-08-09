import { FieldErrors, UseFormRegister } from "react-hook-form";
import { InputField } from "../../../../resources/inputs/input-field";
import { useTranslation } from "react-i18next";
import React from "react";
type AuthFormData =
  | {
      email: string;
      password: string;
      confirm_password: string;
    }
  | {
      email: string;
      password: string;
      confirm_password: never;
    }
  | {
      email: string;
      password: never;
      confirm_password: never;
    };

interface AuthInputProps {
  register: UseFormRegister<AuthFormData>;
  errors: FieldErrors;
  action: "register" | "login" | "confirm-reset-password" | "reset-password";
}

const inputConfig = {
  email: {
    type: "email",
    placeholder: "email",
    validation: { required: "Email is required" },
  },
  password: {
    type: "password",
    validation: { required: "Password is required" },
  },
  confirm_password: {
    type: "password",
    validation: { required: "Confirm Password is required" },
  },
} as const;

type InputConfigKey = keyof typeof inputConfig;

const AuthInputs: React.FC<AuthInputProps> = ({ register, errors, action }) => {
  const { t } = useTranslation();
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
          (typeof inputConfig)[InputConfigKey]
        ][]
      ).map(
        ([name, config]) =>
          fieldsToShow[name] && (
            <InputField<AuthFormData>
              {...config}
              key={name}
              register={register}
              errors={errors}
              name={name}
              placeholder={t(`auth.${name}`)}
            />
          )
      )}
    </>
  );
};

export default AuthInputs;
