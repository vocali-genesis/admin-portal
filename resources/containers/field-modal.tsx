import React, { useState, useEffect } from "react";
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const options = ["number", "text"];

  useEffect(() => {
    setSelectedOptions([]);
  }, [isOpen]);

  const handleSave = () => {
    if (fieldType === "number") {
      onSave({ maxValue: parseInt(selectedOptions[0] || "0") });
    } else if (fieldType === "multiselect") {
      onSave({ options: selectedOptions });
    }
    onClose();
  };

  const handleOptionSelect = (option: string) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option !== optionToRemove),
    );
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
      {fieldType === "number" ? (
        <input
          type="number"
          value={selectedOptions[0] || ""}
          onChange={(e) => setSelectedOptions([e.target.value])}
          placeholder="Enter max value"
          className={`border border-gray-300 ${styles.input}`}
        />
      ) : (
        <div className={styles.multiselectContainer}>
          <div
            className={styles.selectedOptions}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedOptions.map((option, index) => (
              <div key={index} className={styles.optionTag}>
                {option}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(option);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="text"
              readOnly
              placeholder="Select options..."
              className={styles.input}
            />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {options.map((option) => (
                <div
                  key={option}
                  className={styles.dropdownOption}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div
        className="flex justify-end space-x-2"
        style={{ marginTop: "1.5vh" }}
      >
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
