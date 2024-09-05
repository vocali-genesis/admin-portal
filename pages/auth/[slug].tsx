import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Spinner from "@/resources/containers/spinner";
import Image from "next/image";

const Auth = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const Component = ModuleManager.get().components.auth(slug);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!Component) {
      void router.replace("/errors/not-found");
      return;
    }
    setIsLoading(false);
  }, [Component, router]);

  if (!router.isReady || isLoading) {
    return <Spinner />;
  }

  if (!Component) {
    return null;
  }
  return (
    <div className="flex flex-col h-screen bg-white w-full">
      <nav className="custom:flex hidden justify-center items-center bg-[var(--secondary)] h-20">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="Logo" width={120} height={40} />
        </div>
      </nav>
      <div className="flex flex-1">
        <div className="custom:hidden flex-1 flex flex-col justify-center items-center bg-custom-blue text-white p-8">
          <div className="flex justify-center items-center">
            <Image
              src="/logo.svg"
              alt="Login and Register"
              width={400}
              height={60}
            />
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center p-8">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default Auth;
