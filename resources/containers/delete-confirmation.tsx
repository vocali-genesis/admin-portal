import React from "react";
import ConfirmationModal from "./confirm-modal";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  isLeavingPage?: boolean;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  testId?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  confirmButtonText,
  message,
  title,
  testId,
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onConfirm={onConfirm}
      title={title || t("resources.confirm-delete")}
      message={message || t("resources.are-you-sure")}
      confirmButtonText={confirmButtonText || t("common.delete")}
      testId={testId}
    />
  );
};

export default DeleteConfirmation;