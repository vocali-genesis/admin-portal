import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./styles/field-modal.module.css";

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  fieldType: string;
}

const FieldModal: React.FC<FieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fieldType,
}) => {
  const [value, setValue] = useState("");

  const handleSave = () => {
    if (fieldType === "number") {
      onSave({ maxValue: parseInt(value) });
    } else if (fieldType === "multiselect") {
      onSave({ options: value.split(",").map((o) => o.trim()) });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={`items-center ${styles.title}`}>
        <h2 className="text-xl font-semibold">Edit Config</h2>
      </div>
      <input
        type={fieldType === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={fieldType === "number" ? "Enter max value" : "Euro"}
        className={styles.input}
      />
      <div className="flex justify-end mt-6 space-x-2">
        <button
          onClick={onClose}
          className={`${styles.button} ${styles.cancelButton}`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className={`${styles.button} ${styles.createButton}`}
        >
          Create
        </button>
      </div>
    </Modal>
  );
};

export default FieldModal;
