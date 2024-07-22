import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@/services/auth/auth-supabase.service";
import form_style from "./styles/form.module.css";
import { reset_password_schema } from "./auth.schema";
import messageHandler from "@/core/message-handler";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const ResetPasswordForm = () => {
  const t = useTranslations("");
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
    if (response) {
      messageHandler.handleSuccess(
        t("Password reset link has been sent to your email"),
      );
      router.push("/auth/login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form_style.formContainer}
    >
      <Input register={register} errors={errors} action="reset-password" />
      <AuthButton action="Reset Password" />
    </form>
  );
};

export default ResetPasswordForm;
