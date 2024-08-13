import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ConfirmResetPasswordForm from "./forms/confirm-reset-password.form";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./auth.module.css";
import { useTranslation } from "react-i18next";

const ConfirmResetPassword = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const onSuccess = () => {
    router.push("/auth/login");
  };

  return (
    <div className={auth_style.rightColumnContent}>
      <Image
        src="/user.svg"
        alt={t("auth.login-register")}
        width={45}
        height={45}
      />
      <h1 className={auth_style.title}>{t("auth.register")}</h1>
      <ConfirmResetPasswordForm onSuccess={onSuccess} />
      <p className={auth_style.login_text}>
        {t("auth.no-account-question")}{" "}
        <strong>
          <Link href="/auth/register" className={auth_style.register_link}>
            {t("auth.register")}
          </Link>
        </strong>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("confirm-reset-password", ConfirmResetPassword);
