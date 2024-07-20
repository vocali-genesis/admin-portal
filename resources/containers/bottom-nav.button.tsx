import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import AuthService from "@/services/auth/auth-supabase.service";
import logout_btn_styles from "./styles/logout-button.module.css";
import React from "react";

interface bottomNavButtonProps {
  label: string;
}

const BottomNavButton: React.FC<bottomNavButtonProps> = ({ label }) => {
  const t = useTranslations();
  const router = useRouter();

  const logout = () => {
    AuthService.logout();
    router.push("/auth/login");
  };

  return (
    <button className={logout_btn_styles.logoutButton} onClick={logout}>
      <span>{t(label)}</span>
    </button>
  );
};

export default BottomNavButton;
