import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Navbar from "@/resources/containers/nav";
import SideBar from "@/resources/containers/sidebar";
import dash_styles from "@/styles/pages/dashboard.module.css";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";

export const getStaticProps = getStaticPropsWithTranslations;

const Dashboard: React.FC = () => {
  const t = useTranslations("common");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sideBarItems = [
    { icon: "/recordings.svg", label: "Recordings" },
    { icon: "/history.svg", label: "Historical" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={dash_styles.container}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className={dash_styles.contentWrapper}>
        <SideBar
          _activeTab={"Recordings"}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          sideBarItems={sideBarItems}
        />
        <main className={dash_styles.mainContent}>
          <h2 className={dash_styles.h2}>
            {t(
              "Record your consultation or upload an audio with the previously recorded consultation to generate a report",
            )}
          </h2>
          <p className={`${dash_styles.p} ${dash_styles.top_p}`}>
            {t("Activate the audio recorder")}
          </p>

          <div className={dash_styles.contentColumns}>
            <div className={dash_styles.recordSection}>
              <div className={dash_styles.recordButton}>
                <Image
                  src="/recordings.svg"
                  alt="Microphone"
                  width={60}
                  height={60}
                />
              </div>
              <p className={dash_styles.p}>{t("Click To Start Recording")}</p>
            </div>

            <div className={dash_styles.divider}></div>

            <div className={dash_styles.uploadSection}>
              <h3>{t("Upload")}</h3>
              <div className={dash_styles.uploadArea}>
                <Image
                  src="/cloud-avatar.svg"
                  alt="Upload"
                  width={50}
                  height={50}
                />
                <p className={dash_styles.p}>{t("Drag, Drop Or Browse")}</p>
                <small className={dash_styles.small}>
                  {t("Supported Formats: MP3")}
                </small>
              </div>
              <button className={dash_styles.uploadButton}>
                {t("Upload Files")}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
