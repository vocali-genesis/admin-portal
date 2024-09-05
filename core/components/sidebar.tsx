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

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  menu: MenuItem[];
  showHome?: boolean;
}

function renderIcon(item: MenuItem) {
  if (typeof item.icon === "function") {
    return item.icon({});
  }

  return (
    <Image
      className={sidebar_styles.sidebarImageItem}
      src={item.icon}
      alt=""
      width={13}
      height={13}
    />
  );
}

const SideBar: React.FC<SidebarProps> = ({
  isOpen,
  closeSidebar,
  menu,
  showHome,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [origin, setOrigin] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!window) {
      return;
    }
    setOrigin(window.location.origin);
  }, []);

  const logout = async () => {
    await Service.require("oauth").logout();
    await router.push("/auth/login");
  };

  const home = {
    label: "common.home",
    url: `${origin}/app`,
    icon: FaHome,
    order: -1,
  };

  const { slug } = router.query as { slug: string };

  return (
    <aside
      className={`${sidebar_styles.sidebar} ${
        isOpen ? sidebar_styles.open : ""
      }`}
    >
      <button className={sidebar_styles.closeButton} onClick={closeSidebar}>
        ×
      </button>
      <ul className={sidebar_styles.sidebarList}>
        {menu.map((item, index) => (
          <li
            key={index}
            className={`${sidebar_styles.sidebarItem} ${
              item.url === slug ? sidebar_styles.activeTab : ""
            }`}
            onClick={() => void router.push(item.url)}
          >
            {renderIcon(item)}
            {t(item.label)}
          </li>
        ))}
      </ul>
      <div className={sidebar_styles.bottomButtons}>
        {showHome ? (
          <HighlightNavButton
            label={t(home.label)}
            onClick={() => void router.push("/app")}
            image={renderIcon(home)}
          />
        ) : (
          <HighlightNavButton
            label={t("navbar.settings")}
            onClick={() => void router.push("/settings/settings")}
            image={
              <Image
                src="/settings.svg"
                alt="Settings"
                width={21}
                height={21}
              />
            }
          />
        )}

        <BottomNavButton
          label={t("navbar.logout")}
          onClick={() => void logout()}
        />
      </div>
    </aside>
  );
};

export default SideBar;
