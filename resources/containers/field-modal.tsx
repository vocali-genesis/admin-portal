import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./styles/field-modal.module.css";
import { TYPE_OPTIONS } from "@/core/constants";
import BasicInput from "@/resources/inputs/basic-input";

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

  // Convert enum to array of values and omit the fieldType
  const options = Object.values(TYPE_OPTIONS).filter(
    (option) => option !== fieldType,
  );

  useEffect(() => {
    setSelectedOptions([]);
  }, [isOpen]);

  // Hash map to handle different field types for saving
  const fieldTypeHandlers: { [key: string]: () => void } = {
    [TYPE_OPTIONS.NUMBER]: () =>
      onSave({ maxValue: parseInt(selectedOptions[0] || "0") }),
    [TYPE_OPTIONS.MULTISELECT]: () => onSave({ options: selectedOptions }),
    [TYPE_OPTIONS.SELECT]: () => onSave({ options: selectedOptions }),
  };

  const handleSave = () => {
    const handler = fieldTypeHandlers[fieldType];
    if (!handler) return;
    
    handler();
    onClose();
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOptions.includes(option)) return;
    
    setSelectedOptions([...selectedOptions, option]);
    setIsDropdownOpen(false);
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option !== optionToRemove),
    );
  };

  const renderMultiSelect = () => (
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
  );

  const fieldTypeRenderers: { [key: string]: JSX.Element } = {
    [TYPE_OPTIONS.NUMBER]: (
      <BasicInput
        type="number"
        value={selectedOptions[0] || ""}
        onChange={(e) => setSelectedOptions([e.target.value])}
        placeholder="Enter max value"
      />
    ),
    [TYPE_OPTIONS.MULTISELECT]: renderMultiSelect(),
    [TYPE_OPTIONS.SELECT]: renderMultiSelect(),
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
      {/* Render the appropriate UI based on the fieldType */}
      {fieldTypeRenderers[fieldType]}
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
