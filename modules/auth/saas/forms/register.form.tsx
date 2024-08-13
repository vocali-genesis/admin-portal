import React, { FormEventHandler } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import form_style from "./form.module.css";
import { register_schema } from "./auth.schema";
import MessageHandler from "@/core/message-handler";
import AuthInputs from "./auth-inputs";
import SubmitButton from "@/resources/containers/submit.button";
import { useTranslation } from "react-i18next";
import Service from "@/core/module/service.factory";
import { useRouter } from "next/router";

const RegisterForm: React.FC = ({}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(register_schema(t)),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const response = await Service.require("oauth").registerUser(
      data.email,
      data.password
    );
    if (response === null) {
      return;
    }
    MessageHandler.get().handleSuccess(t("common.success"));
    void router.push("/auth/login");
  };

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit) as unknown as FormEventHandler<HTMLElement>
      }
      className={form_style.formContainer}
    >
      <AuthInputs register={register} errors={errors} action="register" />
      <SubmitButton label={t("auth.register")} testId="submitRegistration" />
    </form>
  );
};

export default RegisterForm;
