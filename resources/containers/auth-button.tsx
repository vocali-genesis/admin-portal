import React from "react";
import { useTranslations } from "next-intl";
import form_style from "./styles/auth-button.module.css";

interface AuthButtonProps {
  action: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ action }) => {
  const t = useTranslations("");

  return (
    <div>
      <button type="submit" className={form_style.submitButton}>
        {t(action)}
      </button>
    </div>
  );
};

export default AuthButton;
