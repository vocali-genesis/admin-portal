import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import form_style from "./form.module.css";
import { confirm_reset_password_schema } from "./auth.schema";
import Input from "@/resources/inputs/input";
import AuthButton from "@/resources/containers/auth-button";
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
    resolver: yupResolver(confirm_reset_password_schema),
  });

  const onSubmit = async (data: { password: string }) => {
    const response = await Service.get('oauth').updateUser(
      undefined,
      data.password as string,
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
      <Input
        register={register}
        errors={errors}
        action="confirm-reset-password"
      />
      <AuthButton label={t('auth.reset')} />
    </form>
  );
};

export default ConfirmResetPasswordForm;
