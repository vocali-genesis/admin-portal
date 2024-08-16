import React from "react";
import Modal from "react-modal";
import modal_styles from "./styles/confirmation.module.css";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
}) => {
  const { t } = useTranslation();

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
        <button onClick={onConfirm} className={modal_styles.confirmButton}>
          {confirmButtonText}
        </button>
        <button onClick={onRequestClose} className={modal_styles.cancelButton}>
          {t("common.cancel")}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
