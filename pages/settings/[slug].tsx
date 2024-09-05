import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/core/components/nav";
import SideBar from "@/core/components/sidebar";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";

const Settings = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const Component = ModuleManager.get().components.settings(slug);
  const [isLoading, setIsLoading] = useState(true);

  // --- This logic needs to be refactor
  // This shall go in the reducer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      const user = await Service.require("oauth").getLoggedUser();
      if (!user) {
        return router.push("/auth/login");
      }

      setIsLoading(false);
    })();
  }, [router]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!Component) {
      void router.replace("/errors/not-found");
    }
  }, [Component, router]);

  if (!router.isReady || isLoading) {
    return <Spinner />;
  }
  if (!Component) {
    return null;
  }

  const menu = ModuleManager.get().components.menuSettings;

  return (
    <div className="flex flex-col h-screen bg-white w-full">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow overflow-hidden">
        <SideBar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          menu={menu}
          showHome={true}
        />
        <main className="flex-grow p-5 overflow-y-auto">
          <Component />
        </main>
      </div>
    </div>
  );
};

export default Settings;
