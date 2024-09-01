import Image from "next/image";
import settings_btn_styles from "./styles/settings-button.module.css";
import { useTranslation } from "react-i18next";

interface highlightNavButtonProps {
  label: string;
  onClick: () => void;
}

const HighlightNavButton: React.FC<highlightNavButtonProps> = ({
  label,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <button className={settings_btn_styles.settingsButton} onClick={onClick}>
      <div className={settings_btn_styles.buttonContent}>
        <Image
          src="/settings.svg"
          alt="Settings"
          width={16}
          height={16}
        />
        <span>{t(label)}</span>
      </div>
    </button>
  );
};

export default HighlightNavButton;
