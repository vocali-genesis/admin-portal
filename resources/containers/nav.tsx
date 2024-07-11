import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import nav_styles from "@/styles/components/nav.module.css";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Navbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const t = useTranslations("");

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
