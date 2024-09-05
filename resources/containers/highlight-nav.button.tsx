import Image from "next/image";
import settings_btn_styles from "./styles/settings-button.module.css";
import { useTranslation } from "react-i18next";

interface highlightNavButtonProps {
  label: string;
  image: React.ReactNode; // Updated type
  onClick: () => void;
}

const HighlightNavButton: React.FC<highlightNavButtonProps> = ({
  label,
  onClick,
  image,
}) => {
  const { t } = useTranslation();

  return (
    <button className={settings_btn_styles.settingsButton} onClick={onClick}>
      {image}
      <span className="ml-2">{t(label)}</span>
    </button>
  );
};

export default HighlightNavButton;
