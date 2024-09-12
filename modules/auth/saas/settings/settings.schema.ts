import { TFunction } from "i18next";
import * as yup from "yup";

export const settings_schema = (t: TFunction<"translation", undefined>) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("auth.invalid-email-format"))
      .required(t("auth.email-required")),
    password: yup
      .string()
      .min(8, t("auth.password-min-length", { times: 8 }))
      .required(t("auth.password-required")),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), undefined], t("auth.password-dont-match"))
      .required(t("auth.confirm-password-required")),
  });

export const emailSchema = (t: TFunction<"translation", undefined>) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("auth.invalid-email-format"))
      .required(t("auth.email-required")),
  });

export const passwordSchema = (t: TFunction<"translation", undefined>) =>
  yup.object().shape({
    password: yup
      .string()
      .min(8, t("auth.password-min-length", { times: 8 }))
      .required(t("auth.password-required")),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), undefined], t("auth.password-dont-match"))
      .required(t("auth.confirm-password-required")),
  });