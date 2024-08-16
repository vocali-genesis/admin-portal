import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  GenesisTemplate,
  GenesisTemplateField,
} from "@/core/module/core.types";
import { useTranslation } from "react-i18next";
import styles from "./styles/template-detail.module.css";
import { FaEdit, FaSave, FaTrash, FaArrowLeft, FaPlus } from "react-icons/fa";
import MessageHandler from "@/core/message-handler";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import Table from "@/resources/table/table";
import FieldModal from "@/resources/containers/field-modal";
import Service from "@/core/module/service.factory";
import BasicInput from "@/resources/inputs/basic-input";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import { TYPE_OPTIONS } from "@/core/constants";

const messageHandler = MessageHandler.get();
type TableDataType = GenesisTemplateField & { key: string; name: string };

const TemplateDetail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const templateService = Service.require("templates");
  const { id } = router.query;
  const [template, setTemplate] = useState<GenesisTemplate | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: GenesisTemplateField & { name: string };
  }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [currentFieldKey, setCurrentFieldKey] = useState<string | null>(null);

  useEffect(() => {
    if (!id) router.push("/app/templates");
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    if (!(typeof id === "string")) return;

    const fetchedTemplate = await templateService.getTemplate(+id);
    setTemplate(fetchedTemplate);
  };

  const handleEdit = (fieldKey: string) => {
    setEditingField(fieldKey);
    const field = template?.fields[fieldKey];
    if (!field) return;

    setEditedValues({
      ...editedValues,
      [fieldKey]: { name: fieldKey, ...field },
    });
  };

  const handleSave = async (fieldKey: string) => {
    if (!template) return;

    const { name, ...fieldData } = editedValues[fieldKey];

    if (
      !name.trim() ||
      !fieldData.type.trim() ||
      !fieldData.description.trim()
    ) {
      return messageHandler.handleError(t("templates.fieldEmptyError"));
    }

    const updatedFields = { ...template.fields };

    if (name !== fieldKey) {
      delete updatedFields[fieldKey];
      updatedFields[name] = fieldData;
    } else {
      updatedFields[fieldKey] = fieldData;
    }

    const updatedTemplate = await templateService.updateTemplate(template.id, {
      fields: updatedFields,
    });

    if (!updatedTemplate) {
      messageHandler.handleError(t("templates.editError"));
      return;
    }

    setTemplate(updatedTemplate);
    setEditingField(null);
    setEditedValues({});
    messageHandler.handleSuccess(t("templates.editSuccess"));
  };

  const handleInputChange = (
    fieldKey: string,
    property: string,
    value: string
  ) => {
    setEditedValues({
      ...editedValues,
      [fieldKey]: {
        ...editedValues[fieldKey],
        [property]: value,
      },
    });
  };

  const handleAddField = () => {
    if (!template) return;

    const newFieldKey = `newField${Object.keys(template.fields).length + 1}`;
    const newField: GenesisTemplateField = {
      type: "text",
      description: "New field description",
    };

    setTemplate({
      ...template,
      fields: { ...template.fields, [newFieldKey]: newField },
    });

    setEditingField(newFieldKey);
    setEditedValues({
      ...editedValues,
      [newFieldKey]: { name: newFieldKey, ...newField },
    });
  };

  const confirmDelete = async () => {
    if (!template || !fieldToDelete) return;

    const updatedFields = { ...template.fields };
    delete updatedFields[fieldToDelete];

    const updatedTemplate = await templateService.updateTemplate(template.id, {
      fields: updatedFields,
    });

    if (!updatedTemplate) {
      messageHandler.handleError(t("templates.fieldDeleteError"));
      return;
    }

    setTemplate(updatedTemplate);
    messageHandler.handleSuccess(t("templates.fieldDeleteSuccess"));

    setIsDeleteModalOpen(false);
    setFieldToDelete(null);
  };

  const handleTypeChange = (fieldKey: string, newType: string) => {
    if (newType === "text") return;

    setCurrentFieldKey(fieldKey);
    setIsFieldModalOpen(true);
    handleInputChange(fieldKey, "type", newType);
  };

  const handleFieldModalSave = (data: any) => {
    if (!currentFieldKey) return;

    const updatedField = { ...editedValues[currentFieldKey], ...data };
    setEditedValues({ ...editedValues, [currentFieldKey]: updatedField });
  };

  const handleDeleteField = (fieldKey: string) => {
    setFieldToDelete(fieldKey);
  };

  const columns: ColumnConfig<TableDataType>[] = [
    {
      title: t("templates.field"),
      dataIndex: "name",
      render: (record: TableDataType) =>
        editingField === record.key ? (
          <BasicInput
            value={
              editedValues[record.key]?.name !== undefined
                ? editedValues[record.key].name
                : record.name
            }
            onChange={(e) => {
              handleInputChange(record.key, "name", e.target.value);
            }}
            placeholder={t("templates.fieldNamePlaceholder")}
          />
        ) : (
          <span>{record.name}</span>
        ),
    },
    {
      title: t("templates.type"),
      dataIndex: "type",
      render: (record: TableDataType) =>
        editingField === record.key ? (
          <BasicSelect
            name="fieldType"
            value={
              editedValues[record.key]?.type !== undefined
                ? editedValues[record.key].type
                : record.type
            }
            onChange={(newValue) => handleTypeChange(record.key, newValue)}
            options={Object.values(TYPE_OPTIONS).map((option) => ({
              value: option,
              label: t(`templates.type-${option}`),
            }))}
            disabled={false}
          />
        ) : (
          <span>{record.type}</span>
        ),
    },
    {
      title: t("templates.description"),
      dataIndex: "description",
      render: (record: TableDataType) =>
        editingField === record.key ? (
          <BasicInput
            value={
              editedValues[record.key]?.description !== undefined
                ? editedValues[record.key].description
                : record.description
            }
            onChange={(e) =>
              handleInputChange(record.key, "description", e.target.value)
            }
            placeholder={t("templates.descriptionPlaceholder")}
          />
        ) : (
          <span>{record.description}</span>
        ),
    },
    {
      title: t("templates.action"),
      dataIndex: "key",
      render: (record: TableDataType) => (
        <>
          {editingField === record.key ? (
            <button
              onClick={() => handleSave(record.key)}
              className={styles.actionButton}
            >
              <FaSave style={{ color: "var(--primary)" }} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEdit(record.key)}
                className={styles.actionButton}
              >
                <FaEdit style={{ color: "var(--primary)" }} />
              </button>
              <button
                onClick={() => handleDeleteField(record.key)}
                className={styles.actionButton}
              >
                <FaTrash style={{ color: "#e53e3e" }} />
              </button>
            </>
          )}
        </>
      ),
    },
  ];

  const tableData: TableDataType[] = template
    ? Object.entries(template.fields).map(([key, field]) => ({
        key,
        name: key,
        ...field,
      }))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => router.push("/app/templates")}
          className={styles.backButton}
        >
          <FaArrowLeft /> {t("templates.back")}
        </button>
        <button onClick={handleAddField} className={styles.addFieldButton}>
          <FaPlus /> {t("templates.addField")}
        </button>
      </div>
      <h1 className={styles.title}>{template?.name}</h1>
      <p className={styles.preview}>{template?.preview}</p>

      <Table data={tableData} columns={columns} isLoading={!template} />

      <DeleteConfirmation
        isOpen={fieldToDelete ? true : isDeleteModalOpen}
        onRequestClose={() => setFieldToDelete(null)}
        onConfirm={confirmDelete}
      />

      <FieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSave={handleFieldModalSave}
        fieldType={currentFieldKey ? editedValues[currentFieldKey]?.type : ""}
      />
    </div>
  );
};

GlobalCore.manager.app("template-detail", TemplateDetail);
