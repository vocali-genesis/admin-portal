import React from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/resources/containers/nav";
import SideBar from "@/resources/containers/sidebar";
import dash_styles from "@/styles/pages/dashboard.module.css";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";

export const getStaticProps = getStaticPropsWithTranslations;

const Settings: React.FC = () => {
  const t = useTranslations("common");

  const sideBarItems = [
    { icon: "/profile-avatar.svg", label: "Profile" },
    { icon: "/template-avatar.svg", label: "Templates" },
    { icon: "/profile-avatar.svg", label: "Payments" },
    { icon: "/template-avatar.svg", label: "Organization" },
    { icon: "/profile-avatar.svg", label: "Storage" },
  ];

  return (
    <div className={dash_styles.container}>
      <Navbar />
      <div className={dash_styles.contentWrapper}>
        <SideBar _activeTab="Profile" sideBarItems={sideBarItems}/>
        <main className={dash_styles.mainContent}>
          {/* Main content area */}
        </main>
      </div>
    </div>
  );
};

export default Settings;