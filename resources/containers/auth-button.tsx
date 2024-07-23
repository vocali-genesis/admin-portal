import React from "react";
import form_style from "./styles/auth-button.module.css";

interface AuthButtonProps {
  label: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ label }) => {
  return (
    <div>
      <button type="submit" className={form_style.submitButton}>
        {label}
      </button>
    </div>
  );
};

export default AuthButton;
