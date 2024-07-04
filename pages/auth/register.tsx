import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import RegisterForm from "@/resources/inputs/register-form";
import register_page_style from "@/styles/pages/register.module.css";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("");
  const handleRegisterSuccess = (user: any, token: string) => {
    console.log("Registration successful:", user, token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    router.push("/auth/login");
  };

  return (
    <div className={register_page_style.container}>
      <div className={register_page_style.leftColumn}>
        <div className={register_page_style.logo}>
          <Image
            src="/login-register.svg"
            alt="Login and Register"
            width={400}
            height={60}
          />
        </div>
      </div>
      <div className={register_page_style.rightColumn}>
        <div className={register_page_style.rightColumnContent}>
          <Image
            src="/user.svg"
            alt="Login and Register"
            width={45}
            height={45}
          />
          <h1 className={register_page_style.title}>{t("Register")}</h1>
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          <p className={register_page_style.login_text}>
            {t("Already have an account?")}{" "}
            <Link
              href="/auth/login"
              className={register_page_style.register_link}
            >
              <strong>{t("Login")}</strong>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
