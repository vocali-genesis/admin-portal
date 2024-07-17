import Image from "next/image";
import { useRouter } from 'next/router';
import { useTranslations } from "next-intl";
import settings_btn_styles from "./styles/settings-button.module.css";

const SettingsButton = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <button className={settings_btn_styles.settingsButton} onClick={() => router.push('/settings/settings')}>
      <Image
        className={"pt-1"}
        src="/settings.svg"
        alt="Settings"
        width={13}
        height={13}
      />
      <span>{t("Settings")}</span>
    </button>
  );
};

export default SettingsButton;
