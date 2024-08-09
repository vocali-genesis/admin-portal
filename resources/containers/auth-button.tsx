import React from "react";
import form_style from "./styles/auth-button.module.css";

interface AuthButtonProps {
  label: string;
  testId?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ label, testId }) => {
  return (
    <div>
      <button type="submit" className={form_style.submitButton} data-testid={testId}>
        {label}
      </button>
    </div>
  );
};

export default AuthButton;
