import React, { useState } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/resources/containers/nav";
import SideBar from "@/resources/containers/sidebar";
import dash_styles from "@/styles/pages/dashboard.module.css";

const App = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const Component = ModuleManager.get().components.app(slug);
  // --- This logic needs to be refactor
  // This shall go in the reducer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // This need to load from the manager
  const sideBarItems = [
    { icon: "/recordings.svg", label: "Recordings" },
    { icon: "/history.svg", label: "Historical" },
  ];
 // --- End of refactor


  if (!Component) {
    // TODO: Redirect to 404
    return <>Resource Not Found!</>;
  }

  return (
    <div className={dash_styles.container}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className={dash_styles.contentWrapper}>
        <SideBar
          _activeTab={slug}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          sideBarItems={sideBarItems}
        />
        <main className={dash_styles.mainContent}>
          <Component />
        </main>
      </div>
    </div>
  );
};

export default App;
