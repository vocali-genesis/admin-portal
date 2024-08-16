import React from "react";
import { useTranslation } from "react-i18next";
import DeleteConfirmation from "./delete-confirmation";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  isLeavingPage?: boolean;
}

const OnLeaveConfirmation: React.FC<Props> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <DeleteConfirmation
      title={t("resources.leave-page-title")}
      message={t("resources.leave-page-confirm")}
      confirmButtonText={t("common.leave")}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onConfirm={onConfirm}
    />
  );
};

export default OnLeaveConfirmation;
