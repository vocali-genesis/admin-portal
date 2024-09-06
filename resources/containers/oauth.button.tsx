import React, { useState } from "react";
import oauth_style from "./styles/oauth-button.module.css";
import { GenesisOauthProvider } from "@/core/module/core.types";
import styled from "styled-components";

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
        <Spinner />
      ) : (
        <p>
          {label} <strong>{provider}</strong>
        </p>
      )}
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

export default OAuthButton;
