import React from "react";
import icon_btn_styles from "./styles/icon-button.module.css";

interface IconButtonProps {
  onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  name?: string;
  testId?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  className,
  children,
  name,
  testId,
  size = "medium",
}) => {
  return (
    <button
      onClick={onClick}
      name={name}
      data-testid={testId}
      className={`${icon_btn_styles.iconButton} ${icon_btn_styles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
