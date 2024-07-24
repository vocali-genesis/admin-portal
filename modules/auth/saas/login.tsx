import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import LoginForm from "./forms/login.form";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./auth.module.css";
import { useTranslation } from "react-i18next";


const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const handleLoginSuccess = () => {
    router.push("/app/dashboard");
  };

  return (
    <div className={auth_style.rightColumnContent}>
      <Image src="/user.svg" alt={t('auth.login-register')} width={45} height={45} />
      <h1 className={auth_style.title}>{t("auth.login")}</h1>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
      <p className={auth_style.login_text}>
        {t("auth.no-account-question")}{" "}
        <Link href="/auth/register" className={auth_style.register_link}>
          <strong>{t("auth.register")}</strong>
        </Link>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("login", Login);