import React, { useState } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/core/components/nav";
import SideBar from "@/core/components/sidebar";
import Spinner from "@/resources/containers/spinner";
import { userValidation } from "@/core/components/user-validation";
import { Provider } from "react-redux";
import store from "@/core/store";

const ApplicationSlug = () => {
  const router = useRouter();
  const loader = ModuleManager.get().components;
  const { slug } = router.query as { slug: string };
  const Component = loader.app(slug);

  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  userValidation(() => setIsLoading(false));

  if (!router.isReady) {
    return <Spinner />;
  }

  if (router.isReady && !Component) {
    void router.replace("/errors/not-found");
    return null;
  }

  const menu = ModuleManager.get().components.menus;
  return (
    <div className="flex flex-col h-screen bg-white w-full">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow overflow-hidden">
        <SideBar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          menu={menu}
        />
        <main className="flex-grow p-5 overflow-y-scroll">
          {isLoading ? <Spinner /> : <Component />}
        </main>
      </div>
    </div>
  );
};

const AppSlug = () => {
  return (
    <Provider store={store}>
      <ApplicationSlug />
    </Provider>
  );
}

export default AppSlug;