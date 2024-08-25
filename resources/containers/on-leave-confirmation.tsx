import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "./confirm-modal";
import { useRouter } from "next/router";

interface Props {
  allowedRoutes: string[];
  testId?: string;
}

const OnLeaveConfirmation: React.FC<Props> = ({ allowedRoutes, testId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLeavingPage, setIsLeavingPage] = useState(false);

  const handleLeavePage = (event: BeforeUnloadEvent | PopStateEvent) => {
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
    <ConfirmationModal
      testId={testId}
      title={t("resources.leave-page-title")}
      message={t("resources.leave-page-confirm")}
      confirmButtonText={t("common.leave")}
      isOpen={isLeavingPage}
      onRequestClose={() => setIsLeavingPage(false)}
      onConfirm={() => {
        router.push("/app/dashboard");
      }}
    />
  );
};

export default OnLeaveConfirmation;
