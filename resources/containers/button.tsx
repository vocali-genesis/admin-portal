import React from "react";
import btn_styles from "./styles/button.module.css";

interface ButtonProps {
  onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "action" | "icon" | "danger";
  disabled?: boolean;
  testId?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
  variant = "primary",
  disabled = false,
  testId,
}) => {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`${btn_styles.button} ${btn_styles[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
