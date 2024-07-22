import React, { useState } from "react";
import { useTranslations } from "next-intl";
import SideBar from "@/core/components/sidebar";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GlobalCore } from "@/core/module/module.types";
import settings_styles from "./styles/settings.module.css";

export const getStaticProps = getStaticPropsWithTranslations;

const Settings = () => {
  const t = useTranslations("");

  return (
    <div className={settings_styles.container}>
      <div className={settings_styles.contentWrapper}>
        <main className={settings_styles.mainContent}>
          {/* Main content area */}
        </main>
      </div>
    </div>
  );
};

GlobalCore.manager.settings("settings", Settings);
