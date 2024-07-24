import React, { useState, useTransition } from "react";
import Image from "next/image";
import sidebar_styles from "./styles/sidebar.module.css";
import HighlightNavButton from "@/resources/containers/highlight-nav.button";
import BottomNavButton from "@/resources/containers/bottom-nav.button";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Service from "../module/service.factory";


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
  const { t } = useTranslation()
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(_activeTab);

  const logout = () => {
    Service.get('oauth').logout();
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
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className={sidebar_styles.bottomButtons}>
        <HighlightNavButton label={t("navbar.settings")} onClick={() => router.push("/settings/settings")} />
        <BottomNavButton label={t('navbar.logout')} onClick={logout} />
      </div>
    </aside>
  );
};

export default SideBar;
