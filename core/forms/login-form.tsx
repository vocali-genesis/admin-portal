import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Provider } from "@supabase/supabase-js";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@/services/auth/auth-supabase.service";
import form_style from "./styles/form.module.css";
import { login_schema } from "./schemas/auth-schema";
import messageHandler from "@/core/message-handler";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";
import OAuthButton from "@/resources/containers/oauth-button";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const t = useTranslations("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(login_schema),
  });

  const onSubmit = async (data: any) => {
    const response = await AuthService.loginUser(data.email, data.password);
    if (response) {
      messageHandler.handleSuccess(t("Login successful"));
      onLoginSuccess();
    }
  };

  const handleOAuthClick = async (provider: Provider) => {
    const response = await AuthService.oauth(provider);
    if (response && response.url) window.location.href = response.url;
  };

  const resetPassword = async () => {
    router.push("/auth/reset_password");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form_style.formContainer}
    >
      <Input register={register} errors={errors} action="login" />
      <p
        style={{
          color: "black",
          fontSize: "1.75vh",
          fontFamily: "Montserrat",
          cursor: "pointer",
        }}
        onClick={resetPassword}
      >
        Forgot password?
      </p>
      <AuthButton action="Login" />
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}>
            <strong>{t("Login")}</strong> {t("with others")}:
          </p>
        </div>
        <OAuthButton
          provider="google"
          onClick={handleOAuthClick}
          action="login"
        />
        {/* <OAuthButton
          provider="facebook"
          onClick={handleOAuthClick}
          action="login"
        /> */}
      </div>
    </form>
  );
};

export default LoginForm;