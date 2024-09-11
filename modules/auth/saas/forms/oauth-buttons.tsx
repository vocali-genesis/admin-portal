import { useTranslation } from "react-i18next";
import form_style from "./form.module.css";
import OAuthButton from "@/resources/containers/oauth.button";
import { GenesisOauthProvider } from "@/core/module/core.types";
import Service from "@/core/module/service.factory";
import React from "react";

export const OauthButtons = ({ label }: { label: JSX.Element }) => {
  const { t } = useTranslation();
  const handleOAuthClick = async (provider: GenesisOauthProvider) => {
    const url = await Service.require("oauth").oauth(provider);
    if (url) {
      window.location.assign(url);
    }
  };
  return (
    <div className={form_style.oauth}>
      <div className={form_style.oauthTextContainer}>
        <p className={form_style.oauthText}>{label}:</p>
      </div>
      <OAuthButton
        provider="google"
        onClick={() => handleOAuthClick('google')}
        label={t("auth.register-with")}
      />
      {/* <OAuthButton
          provider="facebook"
          onClick={handleOAuthClick}
          action="register"
        /> */}
    </div>
  );
};
