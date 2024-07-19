import React from "react";
import Modal from "react-modal";
import { useTranslations } from "next-intl";
import modal_styles from "./styles/delete-confirmation.module.css";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  const t = useTranslations("");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modal_styles.modal}
      overlayClassName={modal_styles.overlay}
    >
      <h2>{t("Confirm Delete")}</h2>
      <p>{t("Are you sure you want to delete this recording?")}</p>
      <div className={modal_styles.modalButtons}>
        <button onClick={onConfirm} className={modal_styles.deleteButton}>
          {t("Delete")}
        </button>
        <button onClick={onRequestClose} className={modal_styles.cancelButton}>
          {t("Cancel")}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
