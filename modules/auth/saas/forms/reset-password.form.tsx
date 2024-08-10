import React, { FormEventHandler } from "react";
import { useRouter } from "next/router";
import { useForm, UseFormRegister } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import form_style from "./form.module.css";
import { reset_password_schema } from "./auth.schema";
import AuthInputs from "./auth-inputs";
import SubmitButton from "@/resources/containers/submit.button";
import { useTranslation } from "react-i18next";
import MessageHandler from "@/core/message-handler";
import Service from "@/core/module/service.factory";

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reset_password_schema(t)),
  });

  const onSubmit = async (data: { email: string }) => {
    const response = await Service.get("oauth").resetPassword(data.email);
    if (!response) return;

    MessageHandler.get().handleSuccess(t("auth.reset-email-sent"));
    void router.push("/auth/login");
  };

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit) as unknown as FormEventHandler<HTMLFormElement>
      }
      className={form_style.formContainer}
    >
      <AuthInputs
        register={
          register as unknown as UseFormRegister<{
            email: string;
            password: string; // Not real, but I cant fix the TS issue
            confirm_password: string; // Not real, but I cant fix the TS issue
          }>
        }
        errors={errors}
        action="reset-password"
      />
      <SubmitButton testId="resetPassword" label={t("auth.reset")} />
    </form>
  );
};

export default ResetPasswordForm;
