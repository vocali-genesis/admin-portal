import React from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@/services/auth/auth-supabase.service";
import form_style from "./styles/form.module.css";
import { confirm_reset_password_schema } from "./schemas/auth-schema";
import messageHandler from "@/core/message-handler";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

interface confirmResetPasswordInterface {
  onSuccess: () => void;
}

const ConfirmResetPasswordForm: React.FC<confirmResetPasswordInterface> = ({
  onSuccess,
}) => {
  const t = useTranslations("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(confirm_reset_password_schema),
  });

  const onSubmit = async (data: any) => {
    const response = await AuthService.updateUser(
      undefined,
      data.password as string,
    );
    if (response) {
      messageHandler.handleSuccess(t("Successfully updated password"));
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form_style.formContainer}
    >
      <Input
        register={register}
        errors={errors}
        action="confirm-reset-password"
      />
      <AuthButton action="Reset Password" />
    </form>
  );
};

export default ConfirmResetPasswordForm;
