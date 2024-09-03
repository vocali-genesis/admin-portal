import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";
import styles from "./field-modal.module.css";
import { TYPE_OPTIONS } from "@/core/module/core.types";
import BasicInput from "@/resources/inputs/basic-input";
import Button from "@/resources/containers/button";
import { FieldData } from "@/core/module/core.types";

Modal.setAppElement("body");

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FieldData) => void;
  fieldType: TYPE_OPTIONS;
  initialConfig: FieldData | null;
  testId?: string;
}

type FormData = {
  maxValue?: string;
  options?: string[];
};

const FieldModal: React.FC<FieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fieldType,
  initialConfig,
  testId,
}) => {
  const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>();
  const [newOption, setNewOption] = useState("");
  const selectedOptions = watch("options") || [];

  useEffect(() => {
    if (isOpen && initialConfig) {
      if ("maxValue" in initialConfig) {
        setValue("maxValue", initialConfig.maxValue.toString());
      } else if ("options" in initialConfig) {
        setValue("options", initialConfig.options);
      }
    } else if (isOpen) {
      reset();
      setNewOption("");
    }
  }, [isOpen, initialConfig, setValue, reset]);

  const typeOptions = Object.values(TYPE_OPTIONS).filter(
    (option) => option !== fieldType
  );

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

  const removeOption = (
    optionToRemove: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    setValue(
      "options",
      selectedOptions.filter((option) => option !== optionToRemove)
    );
  };

  const renderMultiselect = () => {
    return (
      <Controller
        name="options"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className={styles.multiselectContainer}>
            {field.value && field.value.length > 0 && (
              <div className={styles.selectedOptions}>
                {field.value.map((option: string, index: number) => (
                  <div key={index} className={styles.optionTag}>
                    {option}
                    <Button
                      variant="action"
                      onClick={(event?) =>
                        removeOption(
                          option,
                          event as React.MouseEvent<HTMLButtonElement>
                        )
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
                testId="field-modal.multi-select-input"
              />
            </div>
          </div>
        )}
      />
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
    [TYPE_OPTIONS.SELECT]: renderMultiselect(),
    [TYPE_OPTIONS.MULTISELECT]: renderMultiselect(),
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
      <form onSubmit={handleSubmit(handleSave)} data-testid={testId}>
        {renderMap[fieldType as keyof typeof renderMap]}
        <div className={styles.modalButtons}>
          <Button onClick={onClose} variant="action">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleSave)}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};

export default FieldModal;
