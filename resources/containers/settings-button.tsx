import Image from "next/image";
import { useTranslations } from "next-intl";
import settings_btn_styles from "./styles/settings-button.module.css";

const SettingsButton = () => {
  const t = useTranslations();

  return (
    <button className={settings_btn_styles.settingsButton}>
      <Image
        className={"pt-1"}
        src="/settings.svg"
        alt="Settings"
        width={13}
        height={13}
      />
      <span>{t("settings")}</span>
    </button>
  );
};

export default SettingsButton;
