import React from "react";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./forms/login.form";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./auth.module.css";
import { useTranslation } from "react-i18next";
import { OauthButtons } from "./forms/oauth-buttons";
import { SettingsInputField } from "@/resources/inputs/settings-input-field";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import { LANGUAGES } from "@/core/constants";

const Login = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className={auth_style.rightColumnContent}>
        <Image
          src="/user.svg"
          alt={t("auth.login-register")}
          width={45}
          height={45}
        />
        <h1 className={auth_style.title}>{t("auth.login")}</h1>
        <LoginForm />
        <OauthButtons
          label={
            <>
              <strong>{t("auth.login")}</strong> {t("auth.with-others")}
            </>
          }
        />
        <p className={auth_style.login_text}>
          {t("auth.no-account-question")}{" "}
          <strong>
            <Link href="/auth/register" className={auth_style.register_link}>
              {t("auth.register")}
            </Link>
          </strong>
        </p>
      </div>
      <div className={auth_style.language_select}>
        <BasicSelect
          name="language"
          value={i18n.language}
          onChange={(lang: string) => void i18n.changeLanguage(lang)}
          options={LANGUAGES.map((lang) => ({
            value: lang,
            label: lang.toUpperCase(),
          }))}
        />
      </div>
    </>
  );
};

GlobalCore.manager.auth("login", Login);
