import React, { useState } from "react";
import styled from "styled-components";
import btn_styles from "./styles/button.module.css";

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
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

const Spinner = styled.span`
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
`;

export default Button;
