import React, { useEffect, useState } from "react";
import Image from "next/image";
import sidebar_styles from "./styles/sidebar.module.css";
import HighlightNavButton from "@/resources/containers/highlight-nav.button";
import BottomNavButton from "@/resources/containers/bottom-nav.button";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Service from "../module/service.factory";
import { MenuItem } from "../module/module.types";
import { FaHome } from "react-icons/fa";
import dynamic from "next/dynamic";



interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  menu: MenuItem[];
  showHome?: boolean
}

function renderIcon(item: MenuItem) {
  if (typeof item.icon === 'function') {
    return (item.icon({}))
  }

  return (
    <Image
      className={sidebar_styles.sidebarImageItem}
      src={item.icon}
      alt=""
      width={13}
      height={13}
    />)

}


const SideBar: React.FC<SidebarProps> = ({
  isOpen,
  closeSidebar,
  menu,
  showHome
}) => {
  const { t } = useTranslation()
  const router = useRouter();
  const [origin, setOrigin] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (!window) {
      return
    }
    setOrigin(window.location.origin);
  }, []);

  const logout = () => {
    Service.get('oauth').logout();
    router.push("/auth/login");
  };

  const home = { label: "common.home", url: `${origin}/app`, icon: FaHome, order: -1 }

  const { slug } = router.query as { slug: string };

  return (
    <aside
      className={`${sidebar_styles.sidebar} ${isOpen ? sidebar_styles.open : ""}`}
    >
      <button className={sidebar_styles.closeButton} onClick={closeSidebar}>
        ×
      </button>
      <ul className={sidebar_styles.sidebarList}>
        {showHome && (
          <li
            className={`${sidebar_styles.sidebarItem}`}
            onClick={() => router.push(home.url)}
          >
            {renderIcon(home)}
            <span>{t(home.label)}</span>
          </li>
        )}
        {menu.map((item, index) => (
          <li
            key={index}
            className={`${sidebar_styles.sidebarItem} ${item.url === slug ? sidebar_styles.activeTab : ""}`}
            onClick={() => router.push(item.url)}
          >
            {renderIcon(item)}
            <span>{t(item.label)}</span>
          </li>
        ))}
      </ul>
      <div className={sidebar_styles.bottomButtons}>
        <HighlightNavButton label={t("navbar.settings")} onClick={() => router.push("/settings/settings")} />
        <BottomNavButton label={t('navbar.logout')} onClick={logout} />
      </div>
    </aside >
  );
};



export default SideBar;
