import React from "react";
import { useForm } from "react-hook-form";
import { Provider } from "@supabase/supabase-js";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@/services/auth/auth-supabase.service";
import form_style from "./form.module.css";
import { register_schema } from "./auth.schema";
import MessageHandler from "@/core/message-handler";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";
import OAuthButton from "@/resources/containers/oauth-button";
import { useTranslation } from "react-i18next";


interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(register_schema),
  });

  const onSubmit = async (data: any) => {
    const response = await AuthService.registerUser(data.email, data.password);
    if (response != null) {
      MessageHandler.get().handleSuccess(t("common.success"));
      onRegisterSuccess();
    }
  };

  const handleOAuthClick = async (provider: Provider) => {
    const response = await AuthService.oauth(provider);
    if (response && response.url) window.location.href = response.url;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form_style.formContainer}
    >
      <Input register={register} errors={errors} action="register" />
      <AuthButton label={t("auth.register")} />
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}>
            <strong>{t("auth.register")}</strong> {t("auth.with-others")}:
          </p>
        </div>
        <OAuthButton
          provider="google"
          onClick={handleOAuthClick}
          label={t("auth.register-with")}
        />
        {/* <OAuthButton
          provider="facebook"
          onClick={handleOAuthClick}
          action="register"
        /> */}
      </div>
    </form >
  );
};

export default RegisterForm;