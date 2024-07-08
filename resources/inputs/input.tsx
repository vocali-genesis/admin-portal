import React from "react";
import { useTranslations } from "next-intl";
import form_style from "@/styles/forms/form.module.css";

interface AuthInputProps {
  register: any;
  errors: any;
}

const Input: React.FC<AuthInputProps> = ({ register, errors }) => {
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
    </>
  );
};

export default Input;
