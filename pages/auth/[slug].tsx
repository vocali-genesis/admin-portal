import React from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Image from "next/image";

const Auth = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const Component = ModuleManager.get().components.auth(slug);

  if (!Component) {
    // TODO: Redirect to 404
    return <>Resource Not Found!</>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <nav className="custom:flex hidden justify-center items-center bg-[#1C364B] h-16">
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
