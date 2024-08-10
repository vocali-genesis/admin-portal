import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Navbar from "@/core/components/nav";
import SideBar from "@/core/components/sidebar";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";

const AppSlug = () => {
  const router = useRouter();
  const loader = ModuleManager.get().components;
  const { slug } = router.query as { slug: string };
  const Component = loader.app(slug);
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
      const { slug } = router.query as { slug: string };
      const user = await Service.get("oauth").getLoggedUser();

      if (!user) {
        return router.push("/auth/login");
      }

      const subscriptionService = Service.get("subscriptions");
      if (!subscriptionService) {
        setIsLoading(false);
        return;
      }
      const subscription = await subscriptionService.getActiveSubscription();
      if (!subscription || subscription.status !== "active") {
        slug !== "subscriptions" && void router.push("/app/subscriptions");
        setIsLoading(false);

        return;
      }
      setIsLoading(false);
    })();
  }, [router]);

  const isSpinner = !router.isReady || isLoading;
  // remove this lines after the i18n fix
  if (isSpinner) {
    return <Spinner />;
  }
  if (router.isReady && !Component) {
    void router.replace("/errors/not-found");
    return null;
  }

  const menu = ModuleManager.get().components.menus;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow overflow-hidden">
        <SideBar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          menu={menu}
        />
        <main className="flex-grow p-5">
          {/* uncomment below line after the i18n issue fix*/}
          {/* { isSpinner ? <Spinner /> : <Component /> } */}
          {/* Remove below line after the i18n issue fix*/}
          {<Component />}
        </main>
      </div>
    </div>
  );
};

export default AppSlug;
