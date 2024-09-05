import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import nav_styles from "@/core/components/styles/nav.module.css";
import { useTranslation } from "react-i18next";
import Service from "../module/service.factory";
import { GenesisUser } from "../module/core.types";

const Navbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<GenesisUser | undefined>(undefined);

  const logout = () => {
    void Service.require("oauth").logout();
    void router.push("/auth/login");
  };

  useEffect(() => {
    void Service.require("oauth")
      .getLoggedUser()
      .then((loggedUser) => {
        if (!loggedUser) {
          return;
        }
        setUser(loggedUser);
      });
  }, []);

  return (
    <nav className={nav_styles.navbar}>
      <div
        className={nav_styles.navbarMobileLeft}
        onClick={() => {
          void router.push("/app");
        }}
      >
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

      <span className={nav_styles.userLabel}>{user?.email}</span>

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
