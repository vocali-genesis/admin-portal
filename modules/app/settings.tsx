import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/resources/containers/nav";
import SideBar from "@/resources/containers/sidebar";
import dash_styles from "@/styles/pages/dashboard.module.css";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GlobalCore } from "@/core/module/module.types";

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
    <div className={dash_styles.container}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className={dash_styles.contentWrapper}>
        <SideBar
          _activeTab={"Profile"}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          sideBarItems={sideBarItems}
        />
        <main className={dash_styles.mainContent}>
          {/* Main content area */}
        </main>
      </div>
    </div>
  );
};

GlobalCore.manager.app('settings', Settings)
