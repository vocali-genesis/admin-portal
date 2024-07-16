import React, { useState } from "react";
import { useTranslations } from "next-intl";
import SideBar from "@/core/components/sidebar";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GlobalCore } from "@/core/module/module.types";
import settings_styles from "./styles/settings.module.css";
import { FaTrash } from "react-icons/fa6";

export const getStaticProps = getStaticPropsWithTranslations;

const Settings = () => {
  const t = useTranslations("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("en");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", { email, password, language });
  };

  const handleDeleteAccount = () => {
    console.log("Delete account requested");
  };

  return (
    <div className={settings_styles.container}>
      <div className={settings_styles.contentWrapper}>
        <main className={settings_styles.mainContent}>
          <form onSubmit={handleSubmit} className={settings_styles.form}>
            <div className={settings_styles.mainFormGroup}>
              <div className={`${settings_styles.formGroup}`}>
                <label htmlFor="email">{t("Email")}:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={`${settings_styles.formGroup}`}>
                <label htmlFor="password">{t("Password")}:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={`${settings_styles.formGroup}`}>
                <label htmlFor="confirm-password">
                  {t("Confirm Password")}:
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={settings_styles.divider} />

            <div className={settings_styles.socialLogins}>
              <button
                type="button"
                onClick=""
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

            <div className={settings_styles.formGroup}>
              <label style={{ paddingTop: "5vh" }} htmlFor="language">
                {t("Language")}:
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
