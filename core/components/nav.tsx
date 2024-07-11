import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import AuthService from "@/services/auth/auth-supabase.service";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import nav_styles from "./styles/nav.module.css";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Navbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const t = useTranslations("");
  const router = useRouter();

  const logout = () => {
    AuthService.logout();
    router.push("/auth/login");
  };

  return (
    <nav className={nav_styles.navbar}>
      <div className={nav_styles.navbarMobileLeft}>
        <Image src="/logo.svg" alt="Genesis" width={100} height={30} />
      </div>
      <div className={nav_styles.navbarLeft}>
        <div className={nav_styles.dropdown}>
          <select>
            <option>{t("Organization")}</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      <div className={nav_styles.navbarRight}>
        <button
          className={`${nav_styles.navRightButton} ${nav_styles.settingsButton}`}
        >
          {t("Settings")}
        </button>
        <button
          className={`${nav_styles.navRightButton} ${nav_styles.logoutButton}`}
          onClick={logout}
        >
          {t("Logout")}
        </button>
      </div>
      <div className={nav_styles.navbarMobileRight}>
        <button className={nav_styles.menuButton} onClick={toggleSidebar}>
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
