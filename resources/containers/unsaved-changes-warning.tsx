import React from "react";
import ConfirmationModal from "./confirm-modal";
import { useTranslation } from "react-i18next";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  testId?: string;
}

const UnsavedChanges: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  testId,
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onConfirm={onConfirm}
      title={t("templates.unsavedChangesTitle")}
      message={t("templates.unsavedChangesMessage")}
      confirmButtonText={t("templates.discardChanges")}
      testId={testId}
    />
  );
};

export default UnsavedChanges;