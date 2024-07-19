import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GlobalCore } from "@/core/module/module.types";
import settings_styles from "./styles/settings.module.css";
import messageHandler from "@/core/message-handler";
import AuthService from "@/services/auth/auth-supabase.service";
import { settings_schema } from "./settings.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaTrash } from "react-icons/fa6";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Settings = () => {
  const t = useTranslations("");
  const [language, setLanguage] = useState("en");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(settings_schema),
  });

  const onSubmit = async (data: any) => {
    const updatedUser = await AuthService.updateUser(data.email, data.password);

    if (updatedUser)
      messageHandler.handleSuccess("Profile updated successfully");
  };

  const handleDeleteAccount = () => {
    console.log("Delete account requested");
  };

  return (
    <div className={settings_styles.container}>
      <div className={settings_styles.contentWrapper}>
        <main className={settings_styles.mainContent}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={settings_styles.form}
          >
            <div className={settings_styles.mainFormGroup}>
              <div className={`${settings_styles.formGroup}`}>
                <div className={settings_styles.inputContainer}>
                  <label htmlFor="email">{t("Email")}:</label>
                  <input type="email" id="email" {...register("email")} />
                </div>
                {errors.email && (
                  <span className={settings_styles.errorMessage}>
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className={`${settings_styles.formGroup}`}>
                <div className={settings_styles.inputContainer}>
                  <label htmlFor="password">{t("New Password")}:</label>
                  <input
                    type="password"
                    id="password"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <span className={settings_styles.errorMessage}>
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className={`${settings_styles.formGroup}`}>
                <div className={settings_styles.inputContainer}>
                  <label htmlFor="confirm-password">
                    {t("Confirm Password")}:
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    {...register("confirm_password")}
                  />
                </div>
                {errors.confirm_password && (
                  <span className={settings_styles.errorMessage}>
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>
            </div>

            <div className={settings_styles.divider} />

            <div className={settings_styles.socialLogins}>
              <button
                type="button"
                className={`${settings_styles.oauthButton} ${settings_styles.googleOAuthButton}`}
              >
                <p>
                  Revoke
                  <strong> google</strong>
                </p>
              </button>
              {/* <button type="button" className={settings_styles.facebookLogin}>
                {t("Sign in with Facebook")}
              </button> */}
            </div>

            <div className={settings_styles.divider} />

            <div className={settings_styles.languageGroup}>
              <label htmlFor="language">{t("Language")}:</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={settings_styles.languageSelect}
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>

            <div className={settings_styles.divider} />

            <button type="submit" className={settings_styles.saveButton}>
              {t("SAVE")}
            </button>

            <div className={settings_styles.divider} />
          </form>
          <button
            onClick={handleDeleteAccount}
            className={settings_styles.deleteAccount}
          >
            <FaTrash size={16} style={{ color: "#DF4949" }} />
            {t("DELETE MY ACCOUNT")}
          </button>
        </main>
      </div>
    </div>
  );
};

GlobalCore.manager.settings("settings", Settings);
