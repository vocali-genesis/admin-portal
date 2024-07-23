import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Provider } from "@supabase/supabase-js";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@/services/auth/auth-supabase.service";
import form_style from "./form.module.css";
import { login_schema } from "./auth.schema";
import MessageHandler from "@/core/message-handler";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";
import OAuthButton from "@/resources/containers/oauth-button";
import { useTranslation } from "react-i18next";


interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
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
      MessageHandler.get().handleSuccess(t("auth.login-successful"));
      onLoginSuccess();
    }
  };

  const handleOAuthClick = async (provider: Provider) => {
    const response = await AuthService.oauth(provider);
    if (response && response.url) window.location.href = response.url;
  };

  const resetPassword = async () => {
    router.push("/auth/reset-password");
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
      <AuthButton label={t('auth.login')} />
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}>
            <strong>{t('auth.login')}</strong> {t('auth.with-others')}:
          </p>
        </div>
        <OAuthButton
          provider="google"
          onClick={handleOAuthClick}
          label={t("auth.login-with")}
        />
        {/* <OAuthButton
          provider="facebook"
          onClick={handleOAuthClick}
          action="login"
        /> */}
      </div>
    </form >
  );
};

export default LoginForm;
