import React from "react";
import Modal from "react-modal";
import modal_styles from "./styles/confirmation.module.css";
import { useTranslation } from "react-i18next";
import Spinner from "./spinner";

Modal.setAppElement("body");

interface ConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  testId?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  testId,
  isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modal_styles.modal}
      overlayClassName={modal_styles.overlay}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <Spinner maxHeight="2rem" />
        </div>
      )}
      <h2>{title}</h2>
      <p>{message}</p>
      <div className={modal_styles.modalButtons} data-testid={testId}>
        <button
          onClick={onConfirm}
          className={modal_styles.confirmButton}
          data-testid="modal.confirm-button"
        >
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
