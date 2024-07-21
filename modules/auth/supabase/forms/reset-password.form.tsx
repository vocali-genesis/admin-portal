import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@/services/auth/auth-supabase.service";
import form_style from "./form.module.css";
import { reset_password_schema } from "./auth.schema";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";
import { useTranslation } from "react-i18next";
import MessageHandler from "@/core/message-handler";


const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reset_password_schema),
  });

  const onSubmit = async (data: any) => {
    const response = await AuthService.resetPassword(data.email);
    if (!response) return;

    MessageHandler.get().handleSuccess(
      t("auth.reset-email-sent"),
    );
    router.push("/auth/login");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form_style.formContainer}
    >
      <Input register={register} errors={errors} action="reset-password" />
      <AuthButton label={t('auth.reset')} />
    </form>
  );
};

export default ResetPasswordForm;
