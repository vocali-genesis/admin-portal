import React from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import form_style from "./form.module.css";
import { confirm_reset_password_schema } from "./auth.schema";
import AuthInputs from "./auth-inputs";
import SubmitButton from "@/resources/containers/submit.button";
import { useTranslation } from "react-i18next";
import MessageHandler from "@/core/message-handler";
import Service from "@/core/module/service.factory";

interface confirmResetPasswordInterface {
  onSuccess: () => void;
}

const ConfirmResetPasswordForm: React.FC<confirmResetPasswordInterface> = ({
  onSuccess,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(confirm_reset_password_schema(t)),
  });

  const onSubmit = async (data: { password: string }) => {
    const response = await Service.require("oauth").updateUser(
      undefined,
      data.password as string
    );
    if (response) {
      MessageHandler.get().handleSuccess(t("common.success"));
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form_style.formContainer}
    >
      <AuthInputs
        register={
          register as unknown as UseFormRegister<{
            email: string; // Not real, but I cant fix the TS issue
            password: string;
            confirm_password: string;
          }>
        }
        errors={errors}
        action="confirm-reset-password"
      />
      <SubmitButton label={t("auth.reset")} />
    </form>
  );
};

export default ConfirmResetPasswordForm;
