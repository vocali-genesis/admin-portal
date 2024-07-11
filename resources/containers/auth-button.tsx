import React from "react";
import { useTranslations } from "next-intl";
import form_style from "@/styles/forms/form.module.css";

interface AuthButtonProps {
  action: "register" | "login";
}

const AuthButton: React.FC<AuthButtonProps> = ({ action }) => {
  const t = useTranslations("");

  return (
    <div className={form_style.buttonWrapper}>
      <button type="submit" className={form_style.submitButton}>
        {action === "register" ? t("Register") : t("Login")}
      </button>
    </div>
  );
};

export default AuthButton;
