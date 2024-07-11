import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import AuthService from "@/services/auth/auth-supabase.service";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import sidebar_styles from "@/styles/components/sidebar.module.css";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

interface sidebarProps {
  _activeTab: string;
  isOpen: boolean;
  closeSidebar: () => void;
  sideBarItems: {
    label: string;
    icon: string;
  }[];
}

const SideBar: React.FC<sidebarProps> = ({
  _activeTab,
  isOpen,
  closeSidebar,
  sideBarItems,
}) => {
  const t = useTranslations("");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(_activeTab);

  const logout = () => {
    AuthService.logout();
    router.push("/auth/login");
  };

  return (
    <aside
      className={`${sidebar_styles.sidebar} ${isOpen ? sidebar_styles.open : ""}`}
    >
      <button className={sidebar_styles.closeButton} onClick={closeSidebar}>
        ×
      </button>
      <ul className={sidebar_styles.sidebarList}>
        {sideBarItems.map((item, index) => (
          <li
            key={index}
            className={`${sidebar_styles.sidebarItem} ${activeTab === item.label ? sidebar_styles.activeTab : ""}`}
            onClick={() => setActiveTab(item.label)}
          >
            <Image
              className={sidebar_styles.sidebarImageItem}
              src={item.icon}
              alt=""
              width={13}
              height={13}
            />
            <span>{t(item.label)}</span>
          </li>
        ))}
      </ul>
      <div className={sidebar_styles.bottomButtons}>
        <button className={sidebar_styles.settingsButton}>
          <Image
            className={sidebar_styles.sidebarImageItem}
            src="/settings.svg"
            alt="Settings"
            width={13}
            height={13}
          />
          <span>{t("settings")}</span>
        </button>
        <button className={sidebar_styles.logoutButton} onClick={logout}>
          {" "}
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
