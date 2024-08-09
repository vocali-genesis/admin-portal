import React, { FormEventHandler } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import form_style from "./form.module.css";
import { login_schema } from "./auth.schema";
import MessageHandler from "@/core/message-handler";
import AuthInputs from "./auth-inputs";
import AuthButton from "@/resources/containers/auth-button";
import OAuthButton from "@/resources/containers/oauth-button";
import { useTranslation } from "react-i18next";
import Service, { useService } from "@/core/module/service.factory";
import { GenesisOauthProvider } from "@/core/module/core.types";
import Link from "next/link";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const authService = useService("oauth");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(login_schema(t)),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const response = await authService.loginUser(data.email, data.password);
    if (!response) {
      return;
    }
    MessageHandler.get().handleSuccess(t("auth.login-successful"));
    onLoginSuccess();
  };

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit) as unknown as FormEventHandler<HTMLFormElement>
      }
      className={form_style.formContainer}
    >
      <AuthInputs register={register} errors={errors} action="login" />
      <Link
        style={{
          color: "black",
          fontSize: "1.75vh",
          fontFamily: "Montserrat",
          cursor: "pointer",
        }}
        href="/auth/reset-password"
      >
        {t("auth.forgot-password")}
      </Link>
      <AuthButton label={t("auth.login")} testId="submitLogin" />
    </form>
  );
};

export default LoginForm;
