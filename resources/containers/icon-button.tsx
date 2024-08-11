import React from "react";
import icon_btn_styles from "./styles/icon-button.module.css";

interface IconButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  className,
  children,
  size = "medium",
}) => {
  return (
    <button
      onClick={onClick}
      className={`${icon_btn_styles.iconButton} ${icon_btn_styles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
