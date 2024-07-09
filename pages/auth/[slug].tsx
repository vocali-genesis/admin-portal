import React from "react";
import { useRouter } from "next/router";
import { ModuleManager } from "@/core/module/module.manager";
import Image from "next/image";
import register_page_style from "@/styles/pages/register.module.css";

const Auth = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const Component = ModuleManager.get().components.auth(slug);
  if (!Component) {
    // TODO: Redirect to 404
    return <>Resource Not Found!</>;
  }
  return (
    <div className={register_page_style.container}>
      <div className={register_page_style.leftColumn}>
        <div className={register_page_style.logo}>
          <Image
            src="/login-register.svg"
            alt="Login and Register"
            width={400}
            height={60}
          />
        </div>
      </div>
      <div className={register_page_style.rightColumn}>
        <Component />
      </div>
    </div>
  );
};

export default Auth;
