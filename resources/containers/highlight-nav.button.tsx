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
    <button
      className={settings_btn_styles.settingsButton}
      onClick={onClick}
    >
      <Image
        src="/settings.svg"
        alt="Settings"
        width={23}
        height={23}
      />
      <span>{t(label)}</span>
    </button>
  );
};

export default HighlightNavButton;
