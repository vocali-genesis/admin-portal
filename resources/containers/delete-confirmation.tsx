import React from "react";
import Modal from "react-modal";
import modal_styles from "./styles/delete-confirmation.module.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modal_styles.modal}
      overlayClassName={modal_styles.overlay}
    >
      <h2>{t("resources.confirm-delete")}</h2>
      <p>{t("resources.are-you-sure")}</p>
      <div className={modal_styles.modalButtons}>
        <button onClick={onConfirm} className={modal_styles.deleteButton}>
          {t("common.delete")}
        </button>
        <button onClick={onRequestClose} className={modal_styles.cancelButton}>
          {t("common.cancel")}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
