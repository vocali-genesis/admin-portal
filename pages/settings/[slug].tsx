import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/core/components/nav";
import SideBar from "@/core/components/sidebar";
import Spinner from '@/resources/containers/spinner';

const Settings = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const Component = ModuleManager.get().components.settings(slug);

  // --- This logic needs to be refactor
  // This shall go in the reducer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // This need to load from the manager
  const sideBarItems = [
    { icon: "/profile-avatar.svg", label: "Profile" },
    { icon: "/template-avatar.svg", label: "Templates" },
    { icon: "/profile-avatar.svg", label: "Payments" },
    { icon: "/template-avatar.svg", label: "Organization" },
    { icon: "/profile-avatar.svg", label: "Storage" },
  ];
  // --- End of refactor

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (!Component) {
      router.replace('errors/not-found')
    }
  }, [Component, router])

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow overflow-hidden">
        <SideBar
          _activeTab={slug}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          sideBarItems={sideBarItems}
        />
        <main className="flex-grow p-5 overflow-y-auto">
          <Component />
        </main>
      </div>
    </div>
  );
};

export default Settings;