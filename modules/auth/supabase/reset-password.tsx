import React from "react";
import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./forms/reset-password.form";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./auth.module.css";
import { useTranslation } from "react-i18next";


const ResetPassword = () => {
  const { t } = useTranslation();

  return (
    <div className={auth_style.rightColumnContent}>
      <Image src="/user.svg" alt={t('auth.login-register')} width={45} height={45} />
      <h1 className={auth_style.title}>{t("auth.reset")}</h1>
      <ResetPasswordForm />
      <p className={auth_style.login_text}>
        {t("auth.no-account-question")}{" "}
        <Link href="/auth/register" className={auth_style.register_link}>
          <strong>{t("auth.register")}</strong>
        </Link>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("reset-password", ResetPassword);
