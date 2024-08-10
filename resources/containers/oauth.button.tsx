import React from "react";
import oauth_style from "./styles/oauth-button.module.css";
import { GenesisOauthProvider } from "@/core/module/core.types";

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
  return (
    <button
      data-testid={provider}
      type="button"
      onClick={() => void onClick(provider)}
      className={`${oauth_style.oauthButton} ${
        oauth_style[`${provider}OAuthButton`]
      }`}
    >
      <p>
        {label} <strong>{provider}</strong>
      </p>
    </button>
  );
};

export default OAuthButton;
