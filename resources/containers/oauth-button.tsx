import React from "react";
import { Provider } from "@supabase/supabase-js";
import oauth_style from "./styles/oauth-button.module.css";

interface OAuthButtonProps {
  provider: Provider;
  onClick: (provider: Provider) => void;
  label: string
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onClick,
  label,
}) => {

  return (
    <button
      type="button"
      onClick={() => onClick(provider)}
      className={`${oauth_style.oauthButton} ${oauth_style[`${provider}OAuthButton`]}`}
    >
      <p>
        {label}{" "}
        <strong>{provider}</strong>
      </p>
    </button>
  );
};

export default OAuthButton;
