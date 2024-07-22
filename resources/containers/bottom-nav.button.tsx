import { useTranslations } from "next-intl";
import logout_btn_styles from "./styles/logout-button.module.css";

interface bottomNavButtonProps {
  label: string;
  onClick: () => void;
}

const BottomNavButton: React.FC<bottomNavButtonProps> = ({
  label,
  onClick,
}) => {
  const t = useTranslations();

  return (
    <button className={logout_btn_styles.logoutButton} onClick={onClick}>
      <span>{t(label)}</span>
    </button>
  );
};

export default BottomNavButton;
