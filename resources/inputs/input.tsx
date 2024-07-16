import React from "react";
import { useTranslations } from "next-intl";
import form_style from "./styles/input.module.css";

interface AuthInputProps {
  register: any;
  errors: any;
  action: string;
}

const Input: React.FC<AuthInputProps> = ({ register, errors, action }) => {
  const t = useTranslations("");

  return (
    <>
      <div className={form_style.formInput}>
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder={t("Email")}
          className={`${form_style.formControl} ${form_style.inputEmailIcon}`}
        />
        {errors.email && (
          <span className={form_style.errorMessage}>
            {t(errors.email.message)}
          </span>
        )}
      </div>
      <div className={form_style.formInput}>
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder={t("Password")}
          className={`${form_style.formControl} ${form_style.inputPasswordIcon}`}
        />
        {errors.password && (
          <span className={form_style.errorMessage}>
            {t(errors.password.message)}
          </span>
        )}
      </div>
      {action === "register" && (
        <div className={form_style.formInput}>
          <input
            {...register("confirm_password", {
              required: "Confirm Password is required",
            })}
            type="password"
            placeholder={t("Confirm Password")}
            className={`${form_style.formControl} ${form_style.inputPasswordIcon}`}
          />
          {errors.confirm_password && (
            <span className={form_style.errorMessage}>
              {t(errors.confirm_password.message)}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default Input;
