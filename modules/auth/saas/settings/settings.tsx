import React, { FormEventHandler } from "react";
import { useForm } from "react-hook-form";
import { GlobalCore } from "@/core/module/module.types";
import settings_styles from "./styles/settings.module.css";
import { settings_schema } from "./settings.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LANGUAGES } from "@/core/constants";
import { useTranslation } from "react-i18next";
import MessageHandler from "@/core/message-handler";
import { useService } from "@/core/module/service.factory";

const messageHandler = MessageHandler.get();

const Divider = () => <div className={settings_styles.divider} />;

const Settings = () => {
  const { t, i18n } = useTranslation();
  const authService = useService("oauth");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(settings_schema(t)),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const updatedUser = await authService.updateUser(data.email, data.password);

    if (updatedUser)
      messageHandler.handleSuccess("Profile updated successfully");
  };

  return (
    <div className={settings_styles.container}>
      <div className={settings_styles.contentWrapper}>
        <main className={settings_styles.mainContent}>
          <form
            onSubmit={
              handleSubmit(onSubmit) as unknown as FormEventHandler<HTMLElement>
            }
            className={settings_styles.form}
          >
            <div className={settings_styles.mainFormGroup}>
              <div className={`${settings_styles.formGroup}`}>
                <div className={settings_styles.inputContainer}>
                  <label htmlFor="email">{t("settings.email")}:</label>
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
                  <label htmlFor="password">
                    {t("settings.new-password")}:
                  </label>
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
                    {t("settings.confirm-password")}:
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

              <div className="flex justify-center">
                <button type="submit" className={settings_styles.saveButton}>
                  {t("settings.save")}
                </button>
              </div>
            </div>
          </form>

          <Divider />

          <div className={settings_styles.socialLogins}>
            {/*  <button
              type="button"
              className={`${settings_styles.oauthButton} ${settings_styles.googleOAuthButton}`}
            >
              <p>
                {t('settings.revoke')}
                <strong> Google</strong>
              </p>
            </button>
          <button type="button" className={settings_styles.facebookLogin}>
                {t("Sign in with Facebook")}
              </button> */}
          </div>

          {/* <Divider /> */}

          <div className={settings_styles.languageGroup}>
            <label htmlFor="language">{t("settings.language")}:</label>
            <select
              id="language"
              value={i18n.language}
              onChange={(e) => void i18n.changeLanguage(e.target.value)}
              className={settings_styles.languageSelect}
            >
              {LANGUAGES.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/*
          // UPCOMMING FEATURE
          <button
            onClick={handleDeleteAccount}
            className={settings_styles.deleteAccount}
          >
            <FaTrash size={16} style={{ color: "#DF4949", marginTop: 4 }} />
            {t("settings.delete-account")}
          </button> */}
        </main>
      </div>
    </div>
  );
};

GlobalCore.manager.settings("settings", Settings);
GlobalCore.manager.menuSettings({
  label: "settings.menu",
  icon: "/profile-avatar.svg",
  url: "settings",
  order: 0,
});
