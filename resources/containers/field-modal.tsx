import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";
import styles from "./styles/field-modal.module.css";
import { TYPE_OPTIONS } from "@/core/module/core.types";
import BasicInput from "@/resources/inputs/basic-input";
import Button from "@/resources/containers/button";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
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
    (option) => option !== fieldType,
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
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

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
            {field.value.length > 0 && (
              <div className={styles.selectedOptions}>
                {field.value.map((option: string, index: number) => (
                  <div key={index} className={styles.optionTag}>
                    {option}
                    <Button
                      onClick={(event?) =>
                        removeOption(
                          option,
                          event as React.MouseEvent<HTMLButtonElement>,
                        )
                      }
                      variant="action"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              testId="field-modal.select-options"
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
            {field.value.length > 0 && (
              <div className={styles.selectedOptions}>
                {field.value.map((option: string, index: number) => (
                  <div key={index} className={styles.optionTag}>
                    {option}
                    <Button
                      variant="action"
                      onClick={(event?) =>
                        removeOption(
                          option,
                          event as React.MouseEvent<HTMLButtonElement>,
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
      <form onSubmit={handleSubmit(handleSave)} data-testid={testId}>
        {renderMap[fieldType as keyof typeof renderMap]}
        <div className={styles.modalButtons}>
          <Button onClick={onClose} variant="action">
            Cancel
          </Button>
          {fieldType === TYPE_OPTIONS.MULTISELECT && (
            <Button
              onClick={addOption}
              testId="field-modal.multi-select-add-option"
            >
              Add
            </Button>
          )}
          <Button onClick={handleSubmit(handleSave)}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};

export default FieldModal;
