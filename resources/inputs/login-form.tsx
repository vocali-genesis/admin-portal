import React from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Provider } from "@supabase/supabase-js";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@/services/auth/auth-supabase.service";
import form_style from "@/styles/forms/form.module.css";
import auth_schema from "@/resources/inputs/form-schemas/auth-schema";
import messageHandler from "@/core/message-handler";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

interface LoginFormProps {
  onLoginSuccess: (user: any, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const t = useTranslations("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(auth_schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await AuthService.loginUser(data.email, data.password);
      if (response) {
        messageHandler.handleSuccess(t("Login successful"));
        onLoginSuccess(response.user, response.token as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        messageHandler.handleError(t(error.message));
      } else {
        messageHandler.handleError(t("An unexpected error occurred"));
      }
    }
  };

  const handleOAuthClick = async (provider: Provider) => {
    try {
      const response = await AuthService.oauth(provider);
      if (response && response.url) window.location.href = response.url;
    } catch (error) {
      if (error instanceof Error) {
        messageHandler.handleError(t(error.message));
      } else {
        messageHandler.handleError(
          t("An unexpected error occurred during OAuth login"),
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form_style.formContainer}
    >
      <div className={form_style.formInput}>
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder={t("Email")}
          className={`${form_style.formControl} ${form_style.inputEmailIcon}`}
        />
        {errors.email && (
          <span className={form_style.errorMessage}>
            {t(errors.email.message)}
          </span>
        )}
      </div>
      <div className={form_style.formInput}>
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder={t("Password")}
          className={`${form_style.formControl} ${form_style.inputPasswordIcon}`}
        />
        {errors.password && (
          <span className={form_style.errorMessage}>
            {t(errors.password.message)}
          </span>
        )}
      </div>
      <div className={form_style.buttonWrapper}>
        <button type="submit" className={form_style.submitButton}>
          {t("Login")}
        </button>
      </div>
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}>
            <strong>{t("Login")}</strong> {t("with others")}:
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOAuthClick("google")}
          className={`${form_style.oauthButton} ${form_style.googleOAuthButton}`}
        >
          <p>
            {" "}
            {t("Login with")} <strong> google</strong>{" "}
          </p>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthClick("facebook")}
          className={`${form_style.oauthButton} ${form_style.facebookOAuthButton}`}
        >
          <p>
            {" "}
            {t("Login with")} <strong> facebook</strong>{" "}
          </p>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
