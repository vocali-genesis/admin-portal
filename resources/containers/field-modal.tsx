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
  const [newOption, setNewOption] = useState<string>("");

  const typeOptions = Object.values(TYPE_OPTIONS).filter(
    (option) => option !== fieldType,
  );

  const handleSave = () => {
    if (fieldType === TYPE_OPTIONS.NUMBER && selectedOptions.length > 0) {
      onSave({ maxValue: parseInt(selectedOptions[0]) });
    } else if (
      [TYPE_OPTIONS.SELECT, TYPE_OPTIONS.MULTISELECT].includes(
        fieldType as TYPE_OPTIONS,
      )
    ) {
      onSave({ options: selectedOptions });
    }

    setSelectedOptions([]);
    onClose();
  };

  const addOption = () => {
    if (newOption.trim() !== "") {
      setSelectedOptions([...selectedOptions, newOption]);
      setNewOption("");
    }
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

  const renderContent = () => {
    if (fieldType === TYPE_OPTIONS.NUMBER) {
      return (
        <BasicInput
          type="number"
          value={selectedOptions[0] || ""}
          onChange={(e) => setSelectedOptions([e.target.value])}
          placeholder="Enter max value"
        />
      );
    } else if (fieldType === TYPE_OPTIONS.SELECT) {
      return (
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
              {typeOptions.map((option) => (
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
    } else if (fieldType === TYPE_OPTIONS.MULTISELECT) {
      return (
        <div className={styles.multiselectContainer}>
          <div className={styles.selectedOptions}>
            {selectedOptions.map((option, index) => (
              <div key={index} className={styles.optionTag}>
                {option}
                <button
                  onClick={() =>
                    setSelectedOptions(
                      selectedOptions.filter((item) => item !== option),
                    )
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add new option"
              className={styles.input}
              onKeyDown={(e) => e.key === "Enter" && addOption()}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.title}>
        <h2>Edit {fieldType} Config</h2>
      </div>
      {renderContent()}
      <div className={styles.modalButtons}>
        <button
          onClick={onClose}
          className={`${styles.cancelButton} ${styles.button}`}
        >
          Cancel
        </button>
        {fieldType === TYPE_OPTIONS.MULTISELECT && (
          <button
            onClick={addOption}
            className={` ${styles.createButton} ${styles.button}`}
            style={{ marginRight: "1vh" }}
          >
            Add
          </button>
        )}
        <button
          onClick={handleSave}
          className={` ${styles.createButton} ${styles.button}`}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default FieldModal;
