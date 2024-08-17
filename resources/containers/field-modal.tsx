import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";
import styles from "./styles/field-modal.module.css";
import { TYPE_OPTIONS } from "@/core/constants";
import BasicInput from "@/resources/inputs/basic-input";
import Button from "@/resources/containers/button";
import { BasicSelect } from "@/resources/inputs/basic-select.input";

Modal.setAppElement("body");

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FieldData) => void;
  fieldType: TYPE_OPTIONS;
}

type FieldData = { maxValue: number } | { options: string[] };

type FormData = {
  maxValue?: string;
  options?: string[];
};

const FieldModal: React.FC<FieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fieldType,
}) => {
  const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>();
  const [newOption, setNewOption] = useState("");
  const selectedOptions = watch("options") || [];

  const typeOptions = Object.values(TYPE_OPTIONS).filter(
    (option) => option !== fieldType,
  );

  useEffect(() => {
    if (isOpen) {
      reset();
      setNewOption("");
    }
  }, [isOpen, reset]);

  const handleSave = (data: FormData) => {
    const saveData: FieldData = {
      [TYPE_OPTIONS.NUMBER]: { maxValue: parseInt(data.maxValue || "0", 10) },
      [TYPE_OPTIONS.SELECT]: { options: data.options || [] },
      [TYPE_OPTIONS.MULTISELECT]: { options: data.options || [] },
    }[
      fieldType as
        | TYPE_OPTIONS.NUMBER
        | TYPE_OPTIONS.SELECT
        | TYPE_OPTIONS.MULTISELECT
    ];

    onSave(saveData);
    onClose();
  };

  const addOption = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (newOption.trim() !== "") {
      setValue("options", [...selectedOptions, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (optionToRemove: string) => {
    setValue(
      "options",
      selectedOptions.filter((option) => option !== optionToRemove),
    );
  };

  const renderMap = {
    [TYPE_OPTIONS.NUMBER]: (
      <Controller
        name="maxValue"
        control={control}
        render={({ field }) => (
          <BasicInput
            type="number"
            {...field}
            placeholder="Enter max value"
            value={field.value || ""}
          />
        )}
      />
    ),
    [TYPE_OPTIONS.SELECT]: (
      <Controller
        name="options"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className={styles.multiselectContainer}>
            <div className={styles.selectedOptions}>
              {(field.value || []).map((option: string, index: number) => (
                <div key={index} className={styles.optionTag}>
                  {option}
                  <button onClick={() => removeOption(option)}>×</button>
                </div>
              ))}
            </div>
            <BasicSelect
              name="selectOptions"
              value=""
              width="52vh"
              onChange={(value) => {
                if (!field.value?.includes(value)) {
                  setValue("options", [...(field.value || []), value]);
                }
              }}
              options={[
                { value: "", label: "Select Option ..." },
                ...typeOptions.map((option) => ({
                  value: option,
                  label: option,
                })),
              ]}
            />
          </div>
        )}
      />
    ),
    [TYPE_OPTIONS.MULTISELECT]: (
      <Controller
        name="options"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className={styles.multiselectContainer}>
            <div className={styles.selectedOptions}>
              {(field.value || []).map((option: string, index: number) => (
                <div key={index} className={styles.optionTag}>
                  {option}
                  <Button variant="action" onClick={() => removeOption(option)}>
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <div>
              <BasicInput
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add new option"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addOption();
                  }
                }}
              />
            </div>
          </div>
        )}
      />
    ),
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
      <form onSubmit={handleSubmit(handleSave)}>
        {renderMap[fieldType as keyof typeof renderMap]}
        <div className={styles.modalButtons}>
          <Button onClick={onClose} variant="action">
            Cancel
          </Button>
          {fieldType === TYPE_OPTIONS.MULTISELECT && (
            <Button onClick={addOption}>Add</Button>
          )}
          <Button onClick={handleSubmit(handleSave)}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};

export default FieldModal;
