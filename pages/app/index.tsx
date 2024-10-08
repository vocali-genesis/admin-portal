import { ModuleManager } from "@/core/module/module.manager";
import Spinner from "@/resources/containers/spinner";
import React from "react";

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/app/" + ModuleManager.get().components.defaultApp(),
      permanent: false,
    },
  };
}

function DefaultApp() {
  return <Spinner />;
}
export default DefaultApp;
