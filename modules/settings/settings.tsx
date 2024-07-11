import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/resources/containers/nav";
import SideBar from "@/resources/containers/sidebar";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GlobalCore } from "@/core/module/module.types";
import settings_styles from "./styles/settings.module.css";

export const getStaticProps = getStaticPropsWithTranslations;

const Settings = () => {
  const t = useTranslations("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sideBarItems = [
    { icon: "/profile-avatar.svg", label: "Profile" },
    { icon: "/template-avatar.svg", label: "Templates" },
    { icon: "/profile-avatar.svg", label: "Payments" },
    { icon: "/template-avatar.svg", label: "Organization" },
    { icon: "/profile-avatar.svg", label: "Storage" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={settings_styles.container}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className={settings_styles.contentWrapper}>
        <SideBar
          _activeTab={"Profile"}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          sideBarItems={sideBarItems}
        />
        <main className={settings_styles.mainContent}>
          {/* Main content area */}
        </main>
      </div>
    </div>
  );
};

GlobalCore.manager.settings("settings", Settings);
