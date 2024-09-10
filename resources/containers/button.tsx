import React, { useState } from "react";
import btn_styles from "./styles/button.module.css";
import { ButtonSpinner } from "./button-spinner";

interface ButtonProps {
  onClick: (
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "action" | "icon" | "danger";
  disabled?: boolean;
  testId?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
  variant = "primary",
  disabled = false,
  testId,
  type = "button",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    try {
      await onClick(event);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      data-testid={testId}
      className={`${btn_styles.button} ${btn_styles[variant]} ${className}`}
      disabled={disabled}
      type={type}
    >
      {isLoading ? <ButtonSpinner hidden={false} /> : children}
    </button>
  );
};

export default Button;
