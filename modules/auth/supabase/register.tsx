import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import RegisterForm from "@/resources/forms/register-form";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./styles/auth.module.css";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Register = () => {
  const router = useRouter();
  const t = useTranslations("");
  const handleRegisterSuccess = () => {
    router.push("/auth/login");
  };

  return (
    <div className={auth_style.rightColumnContent}>
      <Image src="/user.svg" alt="Login and Register" width={45} height={45} />
      <h1 className={auth_style.title}>{t("Register")}</h1>
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      <p className={auth_style.login_text}>
        {t("Already have an account?")}{" "}
        <Link href="/auth/login" className={auth_style.register_link}>
          <strong>{t("Login")}</strong>
        </Link>
      </p>
    </div>
  );
};

GlobalCore.manager.auth("register", Register);
