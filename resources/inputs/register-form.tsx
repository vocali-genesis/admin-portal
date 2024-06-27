<<<<<<< HEAD
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
=======
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerUser } from '@/modules/auth/register-service';
import { oauth } from '@/modules/auth/oauth-service';
import form_style from '@/styles/forms/form.module.css';
import auth_schema from '@/resources/form-schemas/auth-schema';
import { getStaticPropsWithTranslations } from '@/modules/lang/props';

export const getStaticProps = getStaticPropsWithTranslations;

>>>>>>> 73a9076 (Register and login page cosmetics done)
interface RegisterFormProps {
  onRegisterSuccess: (user: any, token: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
<<<<<<< HEAD
  const t = useTranslations("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(auth_schema),
=======
  const t = useTranslations('common');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(auth_schema)
>>>>>>> 73a9076 (Register and login page cosmetics done)
  });

  const onSubmit = async (data: any) => {
    try {
<<<<<<< HEAD
      const response = await AuthService.registerUser(
        data.email,
        data.password,
      );
      if (response != null) {
        messageHandler.handleSuccess(t("Registration successful"));
        onRegisterSuccess(response.user, response.token as string);
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
=======
      const { user, token } = await registerUser(data.email, data.password);
      onRegisterSuccess(user, token);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleOAuthClick = async (provider: string) => {
    try {
      const userData = await oauth(provider);
      // Handle OAuth login success (e.g., redirect, store tokens)
      console.log('OAuth login success:', userData);
    } catch (error) {
      console.error('OAuth login failed:', error);
>>>>>>> 73a9076 (Register and login page cosmetics done)
    }
  };

  return (
<<<<<<< HEAD
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
          {t("Register")}
        </button>
      </div>
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}>
            <strong>{t("Register")}</strong> {t("with others")}:
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOAuthClick("google")}
          className={`${form_style.oauthButton} ${form_style.googleOAuthButton}`}
        >
          <p>
            {" "}
            {t("Register with")} <strong> google</strong>{" "}
          </p>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthClick("facebook")}
          className={`${form_style.oauthButton} ${form_style.facebookOAuthButton}`}
        >
          <p>
            {" "}
            {t("Register with")} <strong> facebook</strong>{" "}
          </p>
=======
    <form onSubmit={handleSubmit(onSubmit)} className={form_style.formContainer}>
      <div className={form_style.formInput}>
        <input 
          {...register('email', { required: 'Email is required' })} 
          type="email" 
          placeholder={t('Email')}
          className={`${form_style.formControl} ${form_style.inputEmailIcon}`} 
        />
        {errors.email && <span className={form_style.errorMessage}>{errors.email.message}</span>}
      </div>
      <div className={form_style.formInput}>
        <input 
          {...register('password', { required: 'Password is required' })} 
          type="password"
          placeholder={t('Password')}
          className={`${form_style.formControl} ${form_style.inputPasswordIcon}`} 
        />
        {errors.password && <span className={form_style.errorMessage}>{errors.password.message}</span>}
      </div>
      <div className={form_style.buttonWrapper}>
        <button type="submit" className={form_style.submitButton}>{t('Register')}</button>
      </div>
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}><strong>{t('Register')}</strong> {t('with others')}:</p>
        </div>
        <button 
          type="button" 
          onClick={() => handleOAuthClick('google')} 
          className={`${form_style.oauthButton} ${form_style.googleOAuthButton}`}
        >
          <p> {t('Register with')} <strong> google</strong> </p>
        </button>
        <button 
          type="button" 
          onClick={() => handleOAuthClick('facebook')} 
          className={`${form_style.oauthButton} ${form_style.facebookOAuthButton}`}
        >
          <p> {t('Register with')} <strong> facebook</strong> </p>
>>>>>>> 73a9076 (Register and login page cosmetics done)
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
