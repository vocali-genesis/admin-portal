import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Provider } from "@supabase/supabase-js";
import { yupResolver } from "@hookform/resolvers/yup";
import form_style from "./form.module.css";
import { login_schema } from "./auth.schema";
import MessageHandler from "@/core/message-handler";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";
import OAuthButton from "@/resources/containers/oauth-button";
import { useTranslation } from "react-i18next";
import Service, { useService } from "@/core/module/service.factory";
import { GenesisOauthProvider } from "@/core/module/core.types";


interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const authService = useService('oauth')

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(login_schema),
  });

  const onSubmit = async (data: any) => {
    const response = await authService.loginUser(data.email, data.password);
    if (response) {
      MessageHandler.get().handleSuccess(t("auth.login-successful"));
      onLoginSuccess();
    }
  };

  const handleOAuthClick = async (provider: GenesisOauthProvider) => {
    const url = await Service.get('oauth').oauth(provider);
    if (url) window.location.href = url;
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
