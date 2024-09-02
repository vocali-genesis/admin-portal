import { FieldErrors, UseFormRegister } from "react-hook-form";
import { InputField } from "@/resources/inputs/input-field";
import { useTranslation } from "react-i18next";
import form_style from "./form.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
type AuthFormData =
  | {
      email: string;
      password: string;
      confirm_password: string;
    }
  | {
      email: never;
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

const InputConfig = {
  email: {
    type: "email",
    placeholder: "email",
    validation: { required: "Email is required" },
    icon: "inputEmailIcon",
  },
  password: {
    type: "password",
    validation: { required: "Password is required" },
    icon: "inputPasswordIcon",
  },
  confirm_password: {
    type: "password",
    validation: { required: "Confirm Password is required" },
    icon: "inputPasswordIcon",
  },
} as const;

/**
 * This pattern is wrong, don't reproduce, input fields could go directly on the parent.
 * Here any change can affect other forms
 */
const AuthInputs: React.FC<AuthInputProps> = ({ register, errors, action }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<{
    [key: string]: boolean;
  }>({});

  const fieldsToShow = {
    register: ["email", "password", "confirm_password"],
    "reset-password": ["email"],
    "confirm-reset-password": ["password", "confirm_password"],
    login: ["email", "password"],
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <>
      {fieldsToShow[action].map((name) => {
        const nameKey = name as keyof typeof InputConfig;
        const config = InputConfig[nameKey];
        if (!config) {
          return null;
        }

        const isPasswordField = config.type === "password";
        const fieldType =
          isPasswordField && showPassword[name] ? "text" : config.type;

        return (
          <div key={name} className={form_style.inputWrapper}>
            <InputField<AuthFormData>
              type={fieldType}
              validation={config.validation}
              register={register}
              errors={errors}
              name={nameKey}
              icon={`${form_style[config.icon]}`}
              placeholder={t(`auth.${name}`)}
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(name)}
                className={form_style.passwordToggle}
              >
                {showPassword[name] ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AuthInputs;
