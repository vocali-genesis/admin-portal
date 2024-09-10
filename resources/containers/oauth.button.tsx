import React, { useState } from "react";
import oauth_style from "./styles/oauth-button.module.css";
import { GenesisOauthProvider } from "@/core/module/core.types";
import { ButtonSpinner } from "./button-spinner";

interface OAuthButtonProps {
  provider: GenesisOauthProvider;
  onClick: (provider: GenesisOauthProvider) => void | Promise<void>;
  label: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onClick,
  label,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (provider: GenesisOauthProvider) => {
    setIsLoading(true);
    try {
      await onClick(provider);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      data-testid={provider}
      type="button"
      onClick={() => void handleClick(provider)}
      className={`${oauth_style.oauthButton} ${
        !isLoading ? oauth_style[`${provider}OAuthButton`] : ""
      }`}
    >
      {isLoading ? (
        <ButtonSpinner hidden={false} />
      ) : (
        <p>
          {label} <strong>{provider}</strong>
        </p>
      )}
    </button>
  );
};

export default OAuthButton;
