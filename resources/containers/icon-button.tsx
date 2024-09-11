import React, { useCallback, useState } from "react";
import icon_btn_styles from "./styles/icon-button.module.css";
import { SmallSpinner } from "./small-spinner";

interface IconButtonProps {
  onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  className?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  name?: string;
  testId?: string;
  title?: string,
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  className,
  children,
  name,
  testId,
  title,
  size = "medium",
}) => {
  const [loading, setLoading] = useState(false)
  const onButtonClick = useCallback(async () => {
    setLoading(true)
    await onClick?.()
    setLoading(false)
  }, [onClick, setLoading])
  return (
    <button
      onClick={() => void onButtonClick()}
      name={name}
      title={title}
      data-testid={testId}
      className={`${icon_btn_styles.iconButton} ${icon_btn_styles[size]} ${className}`}
    >
      {loading ? <SmallSpinner /> : children}
    </button>
  );
};

export default IconButton;
