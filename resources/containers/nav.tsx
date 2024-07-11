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
        <Image
          src="/login-register.svg"
          alt="Genesis"
          width={100}
          height={30}
        />
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
        <button className={nav_styles.upgradeButton}>{t("Upgrade")}</button>
        <Image
          src="/Avatar.svg"
          alt="User"
          width={33}
          height={33}
          className={nav_styles.userIcon}
        />
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
