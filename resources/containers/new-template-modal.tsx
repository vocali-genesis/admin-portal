import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import BasicInput from "@/resources/inputs/basic-input";
import Button from "@/resources/containers/button";
import IconButton from "@/resources/containers/icon-button";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import { useTranslation } from "react-i18next";
import {
  GenesisTemplate,
  GenesisTemplateField,
  TYPE_OPTIONS,
  FieldData,
} from "@/core/module/core.types";
import styles from "./styles/new-template-modal.module.css";
import { FaCog, FaTrash } from "react-icons/fa";
import FieldModal from "@/resources/containers/field-modal";

Modal.setAppElement("body");

interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    template: Omit<GenesisTemplate, "id" | "ownerId" | "createdAt">,
  ) => void;
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [fields, setFields] = useState<Record<string, GenesisTemplateField>>(
    {},
  );
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [currentFieldKey, setCurrentFieldKey] = useState<string | null>(null);
  const [fieldModalConfig, setFieldModalConfig] = useState<FieldData | null>(
    null,
  );
  const fieldNameRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (isOpen && fieldNames.length === 0) {
      addField();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit({
      name,
      preview: `Fields: ${fieldNames.join(", ")}`,
      fields,
    });
    setName("");
    setFields({});
    setFieldNames([]);
  };

  const addField = () => {
    const fieldName = `field${fieldNames.length + 1}`;
    setFields((prev) => ({
      ...prev,
      [fieldName]: { type: TYPE_OPTIONS.TEXT, description: "" },
    }));
    setFieldNames((prev) => [...prev, fieldName]);
  };

  const updateFieldName = (index: number, newName: string) => {
    setFieldNames((prev) => {
      const updated = [...prev];
      updated[index] = newName;
      return updated;
    });
  };

  const updateField = (
    oldName: string,
    newName: string,
    updates: Partial<GenesisTemplateField>,
  ) => {
    setFields((prev) => {
      const newFields = { ...prev };
      if (oldName !== newName) {
        newFields[newName] = { ...newFields[oldName], ...updates };
        delete newFields[oldName];
      } else {
        newFields[oldName] = { ...newFields[oldName], ...updates };
      }
      return newFields;
    });
  };

  const removeField = (fieldName: string) => {
    setFields((prev) => {
      const newFields = { ...prev };
      delete newFields[fieldName];
      return newFields;
    });
    setFieldNames((prev) => prev.filter((name) => name !== fieldName));
  };

  const openFieldConfigModal = (fieldKey: string) => {
    setCurrentFieldKey(fieldKey);
    setFieldModalConfig(fields[fieldKey].config || null);
    setIsFieldModalOpen(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <h2 className={styles.modalTitle}>{t("templates.newTemplate")}</h2>
      <BasicInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("templates.namePlaceholder")}
        testId="new-template-name-input"
        className={`${styles.input} ${styles.name_input}`}
      />
      {fieldNames.map((fieldName, index) => (
        <div key={index} className={styles.fieldContainer}>
          <div className={styles.fieldInputs}>
            <BasicInput
              value={fieldName}
              onChange={(e) => {
                const newName = e.target.value;
                updateFieldName(index, newName);
                updateField(fieldName, newName, {});
              }}
              placeholder={t("templates.fieldNamePlaceholder")}
              className={styles.input}
              ref={(el) => {
                fieldNameRefs.current[fieldName] = el;
                return () => {};
              }}
            />
            <BasicSelect
              name={`${fieldName}-type`}
              value={fields[fieldName].type}
              onChange={(value) =>
                updateField(fieldName, fieldName, {
                  type: value as TYPE_OPTIONS,
                })
              }
              options={Object.values(TYPE_OPTIONS).map((option) => ({
                value: option,
                label: t(`templates.type-${option}`),
              }))}
            />
            <BasicInput
              value={fields[fieldName].description}
              onChange={(e) =>
                updateField(fieldName, fieldName, {
                  description: e.target.value,
                })
              }
              placeholder={t("templates.descriptionPlaceholder")}
              className={styles.input}
            />
          </div>
          <div className={styles.actionButtons}>
            {fields[fieldName].type !== TYPE_OPTIONS.TEXT && (
              <IconButton
                onClick={() => openFieldConfigModal(fieldName)}
                size="small"
                testId="template-detail.edit-field-config"
              >
                <FaCog style={{ color: "var(--primary)" }} />
              </IconButton>
            )}
            <IconButton
              onClick={() => removeField(fieldName)}
              size="small"
              testId="template-detail.remove-field"
            >
              <FaTrash style={{ color: "var(--danger)" }} />
            </IconButton>
          </div>
        </div>
      ))}
      <div className={styles.buttonContainer}>
        <Button
          onClick={addField}
          testId="add-field-button"
          className={styles.button}
        >
          {t("templates.addField")}
        </Button>
        <Button
          onClick={handleSubmit}
          testId="submit-new-template"
          className={styles.button}
        >
          {t("templates.create")}
        </Button>
      </div>
      <FieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSave={(data) => {
          if (currentFieldKey) {
            updateField(currentFieldKey, currentFieldKey, { config: data });
          }
          setIsFieldModalOpen(false);
        }}
        fieldType={
          currentFieldKey ? fields[currentFieldKey]?.type : TYPE_OPTIONS.TEXT
        }
        initialConfig={fieldModalConfig}
        testId="new-template-field-modal"
      />
    </Modal>
  );
};

export default NewTemplateModal;
