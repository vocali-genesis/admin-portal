import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AuthService from "@/services/auth/auth-supabase.service";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/core/components/nav";
import SideBar from "@/core/components/sidebar";
import Spinner from "@/resources/containers/spinner";
// import dash_styles from "@/styles/pages/dashboard.module.css";

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
      const user = await AuthService.getUser();
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

  if (!Component) {
    // TODO: Redirect to 404
    return <Spinner />;
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
        <main className="flex-grow overflow-y-auto">
          <Component />
        </main>
      </div>
    </div>
  );
};

export default App;
