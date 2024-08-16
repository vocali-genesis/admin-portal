import React from "react";
import Modal from "react-modal";
import modal_styles from "./styles/delete-confirmation.module.css";
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
}

const DeleteConfirmation: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  confirmButtonText,
  cancelButtonText,
  message,
  title,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modal_styles.modal}
      overlayClassName={modal_styles.overlay}
    >
      <h2>{title || t("resources.confirm-delete")}</h2>
      <p>{message || t("resources.are-you-sure")}</p>
      <div
        className={modal_styles.modalButtons}
        data-testid="delete-confirmation"
      >
        <button onClick={onConfirm} className={modal_styles.deleteButton}>
          {confirmButtonText || t("common.delete")}
        </button>
        <button onClick={onRequestClose} className={modal_styles.cancelButton}>
          {cancelButtonText || t("common.cancel")}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
