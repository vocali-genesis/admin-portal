import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import sidebar_styles from "./styles/sidebar.module.css";
import { GetStaticProps } from "next";
import SettingsButton from "@/resources/containers/settings-button";
import LogoutButton from "@/resources/containers/logout-button";

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
  const [activeTab, setActiveTab] = useState(_activeTab);

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
        <SettingsButton />
        <LogoutButton />
      </div>
    </aside>
  );
};

export default SideBar;