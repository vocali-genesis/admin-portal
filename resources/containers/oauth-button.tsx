import React from "react";
import { useTranslations } from "next-intl";
import { Provider } from "@supabase/supabase-js";
import oauth_style from "./styles/oauth-button.module.css";

interface OAuthButtonProps {
  provider: Provider;
  onClick: (provider: Provider) => void;
  action: "register" | "login";
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onClick,
  action,
}) => {
  const t = useTranslations("");

  return (
    <button
      type="button"
      onClick={() => onClick(provider)}
      className={`${oauth_style.oauthButton} ${oauth_style[`${provider}OAuthButton`]}`}
    >
      <p>
        {action === "register" ? t("Register with") : t("Login with")}{" "}
        <strong>{provider}</strong>
      </p>
    </button>
  );
};

export default OAuthButton;