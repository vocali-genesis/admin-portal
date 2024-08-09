import React from "react";
import Link from "next/link";
import Image from "next/image";
import RegisterForm from "./forms/register.form";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./auth.module.css";
import { useTranslation } from "react-i18next";
import { OauthButtons } from "./forms/oauth-buttons";

const Register = () => {
  const { t } = useTranslation();

  return (
    <div className={auth_style.rightColumnContent}>
      <Image
        src="/user.svg"
        alt={t("auth.login-register")}
        width={45}
        height={45}
      />
      <h1 className={auth_style.title}>{t("auth.register")}</h1>
      <RegisterForm />
      <OauthButtons
        label={
          <>
            <strong>{t("auth.register")}</strong> {t("auth.with-others")}
          </>
        }
      />
      <p className={auth_style.login_text}>
        {t("auth.no-account-question")}{" "}
        <strong>
          <Link href="/auth/login" className={auth_style.register_link}>
            {t("auth.login")}
          </Link>
        </strong>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("register", Register);
