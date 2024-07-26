import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import RegisterForm from "./forms/register.form";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./auth.module.css";
import { useTranslation } from "react-i18next";


const Register = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const handleRegisterSuccess = () => {
    router.push("/auth/login");
  };

  return (
    <div className={auth_style.rightColumnContent}>
      <Image src="/user.svg" alt={t('auth.login-register')} width={45} height={45} />
      <h1 className={auth_style.title}>{t("auth.register")}</h1>
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      <p className={auth_style.login_text}>
        {t("auth.no-account-question")}{" "}
        <Link href="/auth/login" className={auth_style.register_link}>
          <strong>{t("auth.login")}</strong>
        </Link>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("register", Register);
