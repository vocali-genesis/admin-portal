import i18n from "@/core/i18n";
import * as yup from "yup";

export const settings_schema = yup.object().shape({
  email: yup
    .string()
    .email(i18n.t("auth.invalid-email-format"))
    .required(i18n.t("auth.email-required")),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required(i18n.t("auth.password-required")),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), undefined], i18n.t("auth.password-dont-match"))
    .required(i18n.t("confirm-password-required")),
});
