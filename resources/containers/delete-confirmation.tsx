import React from "react";
import ConfirmationModal from "./confirm-modal";
import { useTranslation } from "react-i18next";
import Spinner from "@/resources/containers/spinner";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLeavingPage?: boolean;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  testId?: string;
  isLoading?: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  confirmButtonText,
  message,
  title,
  testId,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title={title || t("resources.confirm-delete")}
      message={message || t("resources.are-you-sure")}
      confirmButtonText={confirmButtonText || t("common.delete")}
      testId={testId}
    />
  );
};

export default DeleteConfirmation;
