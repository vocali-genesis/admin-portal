import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/core/components/nav";
import SideBar from "@/core/components/sidebar";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";

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

  useEffect(() => {
    const checkAuth = async () => {
      const user = await Service.get('oauth').getLoggedUser();
      if (user === null) router.push("/auth/login");
    };
    checkAuth();
  }, [router]);

  // This need to load from the manager
  const sideBarItems = [
    { icon: "/recordings.svg", label: "Recordings" },
    { icon: "/history.svg", label: "Historical" },
  ];
  // --- End of refactor

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (!Component) {
      router.replace('/errors/not-found')
    }
  }, [Component, router])
  if (!router.isReady) {
    return <Spinner />;
  }
  if (!Component) {
    return null
  }
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

export default App;