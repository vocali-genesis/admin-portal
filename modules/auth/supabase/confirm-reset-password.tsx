import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import ConfirmResetPasswordForm from "@/core/forms/confirm-reset-password-form";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./styles/auth.module.css";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const ConfirmResetPassword = () => {
  const router = useRouter();
  const t = useTranslations("");

  const onSuccess = () => {
    router.push("/auth/login");
  };

  return (
    <div className={auth_style.rightColumnContent}>
      <Image src="/user.svg" alt="Login and Register" width={45} height={45} />
      <h1 className={auth_style.title}>{t("New password")}</h1>
      <ConfirmResetPasswordForm onSuccess={onSuccess} />
      <p className={auth_style.login_text}>
        {t("Dont have an account?")}{" "}
        <Link href="/auth/register" className={auth_style.register_link}>
          <strong>{t("Register")}</strong>
        </Link>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("confirm_reset_password", ConfirmResetPassword);
