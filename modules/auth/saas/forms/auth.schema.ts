import { TFunction } from "i18next";
import * as yup from "yup";

export const reset_password_schema = (t: TFunction<"translation", undefined>) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("auth.invalid-email-format"))
      .required(t("auth.email-required")),
  });

export const confirm_reset_password_schema = (
  t: TFunction<"translation", undefined>
) =>
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

export const login_schema = (t: TFunction<"translation", undefined>) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("auth.invalid-email-format"))
      .required(t("auth.email-required")),
    password: yup
      .string()
      .min(8, t("auth.password-min-length", { times: 8 }))
      .required(t("auh.password-required")),
  });

export const register_schema = (t: TFunction<"translation", undefined>) =>
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
