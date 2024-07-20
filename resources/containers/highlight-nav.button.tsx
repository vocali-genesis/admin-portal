import Image from "next/image";
import { useTranslations } from "next-intl";
import settings_btn_styles from "./styles/settings-button.module.css";

interface highlightNavButtonProps {
  label: string;
  onClick: () => void;
}

const HighlightNavButton: React.FC<highlightNavButtonProps> = ({ label, onClick }) => {
  const t = useTranslations();

  return (
    <button
      className={settings_btn_styles.settingsButton}
      onClick={onClick}
    >
      <Image
        className={"pt-1"}
        src="/settings.svg"
        alt="Settings"
        width={13}
        height={13}
      />
      <span>{t(label)}</span>
    </button>
  );
};

export default HighlightNavButton;
