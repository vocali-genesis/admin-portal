import { useEffect } from "react";
import { useRouter } from "next/router";
import Service from "@/core/module/service.factory";
import React from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await Service.get("oauth").getLoggedUser();
      await router.push(user === null ? "/auth/login" : "/app/dashboard");
    };
    void checkAuth();
  }, [router]);

  /**
   * Refactor, use the Spinner of the resources here
   */
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-[#59DBBC] rounded-full"></div>
        <div
          className="absolute top-0 left-0 right-0 bottom-0 border-4 border-[#ccc] rounded-full animate-spin"
          style={{ clipPath: "inset(0 0 90%)" }}
        ></div>
      </div>
    </div>
  );
}
