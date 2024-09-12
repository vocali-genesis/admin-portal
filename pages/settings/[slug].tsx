import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/core/components/nav";
import SideBar from "@/core/components/sidebar";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";
import AppFooter from "@/core/components/footer";
import { userValidation } from "@/core/components/user-validation";
import store from "@/core/store";
import { Provider } from "react-redux";

const SettingsSlug = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const Component = ModuleManager.get().components.settings(slug);

  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  userValidation(() => setIsLoading(false));

  useEffect(() => {
    if (!router.isReady) return;

    // Ensure this logic only runs on the client
    void (async () => {
      setIsLoading(true);
      const user = await Service.require("oauth").getLoggedUser();
      if (!user) {
        void router.push("/auth/login");
        return;
      }
      setIsLoading(false);
    })();
  }, [router, router.isReady]);

  useEffect(() => {
    if (router.isReady && !Component) {
      void router.replace("/errors/not-found");
    }
  }, [router, router.isReady, Component]);

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
          {!router.isReady || isLoading ? <Spinner /> : <><Component />    <AppFooter /></>}

        </main>
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <Provider store={store}>
      <SettingsSlug />
    </Provider>
  );
}

export default Settings;
