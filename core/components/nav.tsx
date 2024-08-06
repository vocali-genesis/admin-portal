import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import nav_styles from "@/core/components/styles/nav.module.css";
import { useTranslation } from "react-i18next";
import Service from "../module/service.factory";

const Navbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const logout = () => {
    Service.get("oauth")?.logout();
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
            <option>{t("navbar.organization")}</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      <button
        className={`${nav_styles.navRightButton} ${nav_styles.logoutButton}`}
        onClick={logout}
      >
        {t("navbar.logout")}
      </button>
      <div className={nav_styles.navbarMobileRight}>
        <button className={nav_styles.menuButton} onClick={toggleSidebar}>
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
