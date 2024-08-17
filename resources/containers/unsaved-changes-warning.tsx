import React from "react";
import Modal from "react-modal";
import modal_styles from "./styles/delete-confirmation.module.css";
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modal_styles.modal}
      overlayClassName={modal_styles.overlay}
    >
      <h2>{t("templates.unsavedChangesTitle")}</h2>
      <p>{t("templates.unsavedChangesMessage")}</p>
      <div className={modal_styles.modalButtons} data-testid={testId}>
        <button onClick={onConfirm} className={modal_styles.deleteButton}>
          {t("templates.discardChanges")}
        </button>
        <button onClick={onRequestClose} className={modal_styles.cancelButton}>
          {t("common.cancel")}
        </button>
      </div>
    </Modal>
  );
};

export default UnsavedChanges;
