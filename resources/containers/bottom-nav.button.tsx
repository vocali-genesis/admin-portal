import logout_btn_styles from "./styles/logout-button.module.css";

interface BottomNavButtonProps {
  label: string;
  onClick: () => void;
}

const BottomNavButton: React.FC<BottomNavButtonProps> = ({ label, onClick }) => {

  return (
    <button className={logout_btn_styles.logoutButton} onClick={onClick}>
      <span>{label}</span>
    </button>
  );
};

export default BottomNavButton;
