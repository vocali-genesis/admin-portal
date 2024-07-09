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
    <div className="flex h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center items-center bg-custom-blue text-white p-8">
        <div className="mb-8">
          <Image
            src="/login-register.svg"
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
  );
};

export default Auth;
