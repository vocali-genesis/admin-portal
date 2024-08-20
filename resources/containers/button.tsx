import React from "react";
import btn_styles from "./styles/button.module.css";

interface ButtonProps {
  onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "action" | "icon";
  testId?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
  variant = "primary",
  testId,
}) => {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`${btn_styles.button} ${btn_styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
