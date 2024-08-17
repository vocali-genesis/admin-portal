import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import ConfirmationModal from "./confirm-modal";
import { useTranslation } from "react-i18next";

interface LeavePageConfirmProps {
  when: boolean;
  onConfirm: () => void;
}

const LeavePageConfirm: React.FC<LeavePageConfirmProps> = ({
  when,
  onConfirm,
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    [when],
  );

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (when && url !== router.asPath) {
        setShowModal(true);
        router.events.emit("routeChangeError");
        throw "routeChange aborted.";
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, router, handleBeforeUnload]);

  useEffect(() => {
    if (when) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
    return () => {
      window.onbeforeunload = null;
    };
  }, [when]);

  const handleConfirm = () => {
    setShowModal(false);
    onConfirm();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <ConfirmationModal
      isOpen={showModal}
      onRequestClose={handleCancel}
      onConfirm={handleConfirm}
      title={t("resources.leave-page-title")}
      message={t("resources.leave-page-confirm")}
      confirmButtonText={t("common.leave")}
    />
  );
};

export default LeavePageConfirm;
