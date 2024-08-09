import i18n from "@/core/i18n";
import * as yup from "yup";

export const reset_password_schema = yup.object().shape({
  email: yup
    .string()
    .email(i18n.t("auth.invalid-email-format"))
    .required(i18n.t("auth.email-required")),
});

export const confirm_reset_password_schema = yup.object().shape({
  password: yup
    .string()
    .min(8, i18n.t("auth.password-min-length", { times: 8 }))
    .required(i18n.t("auth.password-required")),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), undefined], i18n.t("auth.password-dont-match"))
    .required(i18n.t("auth.confirm-password-required")),
});

export const login_schema = yup.object().shape({
  email: yup
    .string()
    .email(i18n.t("auth.invalid-email-format"))
    .required(i18n.t("auth.email-required")),
  password: yup
    .string()
    .min(8, i18n.t("auth.password-min-length", { times: 8 }))
    .required(i18n.t("auh.password-required")),
});

export const register_schema = yup.object().shape({
  email: yup
    .string()
    .email(i18n.t("auth.invalid-email-format"))
    .required(i18n.t("auth.email-required")),
  password: yup
    .string()
    .min(8, i18n.t("auth.password-min-length", { times: 8 }))
    .required(i18n.t("auth.password-required")),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), undefined], i18n.t("auth.password-dont-match"))
    .required(i18n.t("auth.confirm-password-required")),
});
