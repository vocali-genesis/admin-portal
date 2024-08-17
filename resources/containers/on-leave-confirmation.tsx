import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteConfirmation from "./delete-confirmation";
import { useRouter } from "next/router";

interface Props {
  allowedRoutes: string[];
  testId?: string;
}

// TODO : Check on router change event aswell, except for allowedRoutes
const OnLeaveConfirmation: React.FC<Props> = ({ allowedRoutes, testId }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isLeavingPage, setIsLeavingPage] = useState(false);

  const handleLeavePage = (event: BeforeUnloadEvent | PopStateEvent) => {
    console.log(event);
    if (event.type === "beforeunload") {
      event.preventDefault();
      event.returnValue = "";
    }
    setIsLeavingPage(true);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleLeavePage);
    window.addEventListener("popstate", handleLeavePage);

    return () => {
      window.removeEventListener("beforeunload", handleLeavePage);
      window.removeEventListener("popstate", handleLeavePage);
    };
  }, []);

  useEffect(() => {
    // TODO: If is allow url don't give the error
    router.beforePopState(() => {
      setIsLeavingPage(true);
      return false;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  return (
    <DeleteConfirmation
      testId={testId}
      title={t("resources.leave-page-title")}
      message={t("resources.leave-page-confirm")}
      confirmButtonText={t("common.leave")}
      isOpen={isLeavingPage}
      onRequestClose={() => setIsLeavingPage(false)}
      onConfirm={() => 1}
    />
  );
};

export default OnLeaveConfirmation;
