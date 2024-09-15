import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "./confirm-modal";
import { useRouter } from "next/router";

interface Props {
  testId?: string;
}

const OnLeaveConfirmation: React.FC<Props> = ({ testId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleLeavePage = useCallback((event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleLeavePage);

    return () => {
      window.removeEventListener("beforeunload", handleLeavePage);
    };
  }, [handleLeavePage]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url !== router.asPath && !isConfirmed) {
        router.events?.emit("routeChangeError");
        setNextUrl(url);
        setIsLeavingPage(true);
        throw "Route change aborted";
      }
    };

    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router, isConfirmed]);

  const handleConfirm = useCallback(() => {
    setIsConfirmed(true);
    setIsLeavingPage(false);
    if (nextUrl) {
      void router.push(nextUrl);
    }
  }, [nextUrl, router]);

  const handleRequestClose = useCallback(() => {
    setIsLeavingPage(false);
    setNextUrl(null);
  }, []);

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsConfirmed(false);
    };

    router.events?.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events?.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <ConfirmationModal
      testId={testId}
      title={t("resources.leave-page-title")}
      message={t("resources.leave-page-confirm")}
      confirmButtonText={t("common.leave")}
      isOpen={isLeavingPage}
      onRequestClose={handleRequestClose}
      onConfirm={handleConfirm}
    />
  );
};

export default OnLeaveConfirmation;