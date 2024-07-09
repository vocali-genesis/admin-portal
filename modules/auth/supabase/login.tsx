import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import LoginForm from "@/resources/forms/login-form";
import register_page_style from "@/styles/pages/register.module.css";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import { GlobalCore } from "@/core/module/module.types";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Login = () => {
  const router = useRouter();
  const t = useTranslations("");
  const handleLoginSuccess = () => {
    router.push("/app/dashboard");
  };

  return (
    <div className={register_page_style.rightColumnContent}>
      <Image src="/user.svg" alt="Login and Register" width={45} height={45} />
      <h1 className={register_page_style.title}>{t("Login")}</h1>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
      <p className={register_page_style.login_text}>
        {t("Dont have an account?")}{" "}
        <Link
          href="/auth/register"
          className={register_page_style.register_link}
        >
          <strong>{t("Register")}</strong>
        </Link>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("login", Login);
