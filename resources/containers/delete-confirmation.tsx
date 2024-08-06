import React from "react";
import Modal from "react-modal";
import modal_styles from "./styles/delete-confirmation.module.css";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  isLeavingPage?: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  isLeavingPage = false,
}) => {
  const { t } = useTranslation();

  const title = isLeavingPage
    ? t("resources.leave-page-title")
    : t("resources.confirm-delete");

  const message = isLeavingPage
    ? t("resources.leave-page-confirm")
    : t("resources.are-you-sure");

  const confirmButtonText = isLeavingPage
    ? t("common.leave")
    : t("common.delete");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modal_styles.modal}
      overlayClassName={modal_styles.overlay}
    >
      <h2>{title}</h2>
      <p>{message}</p>
      <div className={modal_styles.modalButtons}>
        <button onClick={onConfirm} className={modal_styles.deleteButton}>
          {confirmButtonText}
        </button>
        <button onClick={onRequestClose} className={modal_styles.cancelButton}>
          {t("common.cancel")}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
