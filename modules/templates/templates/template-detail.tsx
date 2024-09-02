import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  GenesisTemplate,
  GenesisTemplateField,
} from "@/core/module/core.types";
import { useTranslation } from "react-i18next";
import styles from "./styles/template-detail.module.css";
import {
  FaEdit,
  FaSave,
  FaTrash,
  FaArrowLeft,
  FaPlus,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import MessageHandler from "@/core/message-handler";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import Table from "@/resources/table/table";
import UnsavedChanges from "@/resources/containers/unsaved-changes-warning";
import FieldModal from "@/resources/containers/field-modal";
import Service from "@/core/module/service.factory";
import { SupabaseTemplateService } from "@/core/module/services.types";
import BasicInput from "@/resources/inputs/basic-input";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import {
  TYPE_OPTIONS,
  FieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
} from "@/core/module/core.types";
import Pagination from "@/resources/table/pagination";
import Button from "@/resources/containers/button";
import IconButton from "@/resources/containers/icon-button";
import { FieldData } from "@/core/module/core.types";

const messageHandler = MessageHandler.get();
type TableDataType = GenesisTemplateField & { key: string; name: string };

const TemplateDetail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const templateService: SupabaseTemplateService = Service.require("templates");
  const { id } = router.query;

  const [template, setTemplate] = useState<GenesisTemplate | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<
    Record<string, GenesisTemplateField & { name: string }>
  >({});
  const [newField, setNewField] = useState<string | null>(null);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [unsavedChangesModalOpen, setUnsavedChangesModalOpen] = useState(false);
  const [pendingEditField, setPendingEditField] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fieldModalConfig, setFieldModalConfig] = useState<FieldData | null>(
    null,
  );

  const fetchTemplate = useCallback(
    async (page: number) => {
      if (typeof id !== "string") return;
      setIsLoading(true);
      try {
        const fetchedTemplate = await templateService.getTemplate(id, page, 5);
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate.data[0]);
          setPagination({
            currentPage: page,
            totalPages: fetchedTemplate.totalPages,
            totalRecords: fetchedTemplate.totalCount,
          });
        }
      } catch (error) {
        messageHandler.handleError(t("templates.fetchError"));
      } finally {
        setIsLoading(false);
      }
    },
    [id, templateService, t],
  );

  useEffect(() => {
    if (!id) router.push("/app/templates");
    else fetchTemplate(pagination.currentPage);
  }, [id, pagination.currentPage, fetchTemplate, router]);

  const handlePageChange = (page: number) =>
    setPagination((prev) => ({ ...prev, currentPage: page }));

  const handleEdit = (fieldKey: string) => {
    if (editingField && editingField !== fieldKey) {
      setPendingEditField(fieldKey);
      setUnsavedChangesModalOpen(true);
    } else {
      setEditingField(fieldKey);
      const field = template?.fields[fieldKey];
      if (field)
        setEditedValues((prev) => ({
          ...prev,
          [fieldKey]: { name: fieldKey, ...field },
        }));
    }
  };

  const handleCancel = (fieldKey: string) => {
    setEditingField(null);
    setEditedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[fieldKey];
      return newValues;
    });
    if (newField === fieldKey) {
      setNewField(null);
      setTemplate((prev) => {
        if (!prev) return prev;
        const newFields = { ...prev.fields };
        delete newFields[fieldKey];
        return { ...prev, fields: newFields };
      });
    }
  };

  const handleSave = async (fieldKey: string) => {
    if (!template) return;
    const { name, ...fieldData } = editedValues[fieldKey];
    const updatedFields = { ...template.fields };

    if (name !== fieldKey) {
      delete updatedFields[fieldKey];
      updatedFields[name] = fieldData;
    } else {
      updatedFields[fieldKey] = fieldData;
    }

    try {
      const updatedTemplate = await templateService.updateTemplate(
        template.id,
        { fields: updatedFields },
      );
      if (updatedTemplate) {
        setTemplate(updatedTemplate);
        setEditingField(null);
        setEditedValues({});
        messageHandler.handleSuccess(t("templates.editSuccess"));
      }
    } catch (error) {
      messageHandler.handleError(t("templates.editError"));
    }

    setPagination({
      ...pagination,
      totalRecords: pagination.totalRecords + 1,
    });
    setIsFieldModalOpen(false);
  };

  const handleInputChange = (
    fieldKey: string,
    property: string,
    value: string,
  ) => {
    setEditedValues((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], [property]: value },
    }));
  };

  const handleAddField = () => {
    if (!template) return;
    const newFieldKey = `newField${Object.keys(template.fields).length + 1}`;
    const newField: GenesisTemplateField = {
      type: "text" as TYPE_OPTIONS,
      description: "New field description",
    };
    setTemplate((prev) => ({
      ...prev!,
      fields: { ...prev!.fields, [newFieldKey]: newField },
    }));
    setEditingField(newFieldKey);
    setEditedValues((prev) => ({
      ...prev,
      [newFieldKey]: { name: newFieldKey, ...newField },
    }));
    setNewField(newFieldKey);
  };

  const confirmDelete = async () => {
    if (!template || !fieldToDelete) return;
    const updatedFields = { ...template.fields };
    delete updatedFields[fieldToDelete];
    try {
      const updatedTemplate = await templateService.updateTemplate(
        template.id,
        { fields: updatedFields },
      );
      if (updatedTemplate) {
        setTemplate(updatedTemplate);
        messageHandler.handleSuccess(t("templates.fieldDeleteSuccess"));
      }
    } catch (error) {
      messageHandler.handleError(t("templates.fieldDeleteError"));
    } finally {
      setFieldToDelete(null);
    }

    setPagination({
      ...pagination,
      totalRecords: pagination.totalRecords - 1,
    });
  };

  function isNumberFieldConfig(
    config: FieldConfig,
  ): config is NumberFieldConfig {
    return "maxValue" in config;
  }

  function isSelectFieldConfig(
    config: FieldConfig,
  ): config is SelectFieldConfig {
    return "options" in config;
  }

  const columns: ColumnConfig<TableDataType>[] = [
    {
      title: t("templates.field"),
      dataIndex: "name",
      render: (record: TableDataType) =>
        editingField === record.key ? (
          <BasicInput
            value={editedValues[record.key]?.name}
            onChange={(e) =>
              handleInputChange(record.key, "name", e.target.value)
            }
            placeholder={t("templates.fieldNamePlaceholder")}
            testId="template-detail.field-name-input"
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
            value={editedValues[record.key]?.type || record.type}
            onChange={(newValue) =>
              handleInputChange(record.key, "type", newValue)
            }
            options={Object.values(TYPE_OPTIONS).map((option) => ({
              value: option,
              label: t(`templates.type-${option}`),
            }))}
            disabled={false}
            testId="template-detail.field-type-select"
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
            value={editedValues[record.key]?.description}
            onChange={(e) =>
              handleInputChange(record.key, "description", e.target.value)
            }
            placeholder={t("templates.descriptionPlaceholder")}
            testId="template-detail.field-description-input"
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
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton
                onClick={() => handleSave(record.key)}
                size="small"
                testId="template-detail.save-field"
              >
                <FaSave style={{ color: "var(--primary)" }} />
              </IconButton>
              <IconButton
                onClick={() => handleCancel(record.key)}
                size="small"
                testId="template-detail.cancel-edit"
              >
                <FaTimes style={{ color: "var(--danger)" }} />
              </IconButton>
              {["number", "select", "multiselect"].includes(
                editedValues[record.key]?.type,
              ) && (
                <IconButton
                  onClick={() => {
                    const fieldConfig = editedValues[record.key]?.config;
                    let configToUse: FieldConfig;

                    if (
                      editedValues[record.key]?.type === TYPE_OPTIONS.NUMBER &&
                      fieldConfig &&
                      isNumberFieldConfig(fieldConfig)
                    ) {
                      configToUse = { maxValue: fieldConfig.maxValue };
                    } else if (
                      [TYPE_OPTIONS.SELECT, TYPE_OPTIONS.MULTISELECT].includes(
                        editedValues[record.key]?.type,
                      ) &&
                      fieldConfig &&
                      isSelectFieldConfig(fieldConfig)
                    ) {
                      configToUse = { options: fieldConfig.options };
                    } else {
                      configToUse =
                        editedValues[record.key]?.type === TYPE_OPTIONS.NUMBER
                          ? { maxValue: 0 }
                          : { options: [] };
                    }

                    setFieldModalConfig(configToUse);
                    setIsFieldModalOpen(true);
                  }}
                  size="small"
                  testId="template-detail.edit-field-config"
                >
                  <FaCog style={{ color: "var(--primary)" }} />
                </IconButton>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "3vh" }}>
              <IconButton
                onClick={() => handleEdit(record.key)}
                size="small"
                testId="template-detail.edit"
              >
                <FaEdit style={{ color: "var(--primary)" }} />
              </IconButton>
              <IconButton
                onClick={() => setFieldToDelete(record.key)}
                size="small"
                testId="template-detail.delete"
              >
                <FaTrash style={{ color: "var(--danger)" }} />
              </IconButton>
            </div>
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
        <Button
          onClick={() => router.push("/app/templates")}
          variant="secondary"
          className={styles.backButton}
          testId="template-detail.back-button"
        >
          <FaArrowLeft /> {t("templates.back")}
        </Button>
        <Button
          onClick={
            editingField
              ? () => messageHandler.handleError(t("templates.finish-editing"))
              : handleAddField
          }
          variant="primary"
          className={styles.addFieldButton}
          testId="template-detail.add-field"
        >
          <FaPlus /> {t("templates.addField")}
        </Button>
      </div>
      <h1 className={styles.title} data-testid="template-detail.title">
        {template?.name}
      </h1>

      <Table
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        testId="template-detail.table"
      />
      <Pagination
        currentPage={pagination.totalPages === 0 ? 0 : pagination.currentPage}
        totalPages={pagination.totalPages}
        totalRecords={pagination.totalRecords}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmation
        isOpen={!!fieldToDelete}
        onRequestClose={() => setFieldToDelete(null)}
        onConfirm={confirmDelete}
        testId="template-detail.delete-confirmation"
      />

      <UnsavedChanges
        isOpen={unsavedChangesModalOpen}
        onRequestClose={() => setUnsavedChangesModalOpen(false)}
        onConfirm={() => {
          setUnsavedChangesModalOpen(false);
          if (pendingEditField) {
            setEditingField(pendingEditField);
            const field = template?.fields[pendingEditField];
            if (field) {
              setEditedValues((prev) => ({
                ...prev,
                [pendingEditField]: { name: pendingEditField, ...field },
              }));
            }
            setPendingEditField(null);
          }
        }}
      />

      <FieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSave={async (data) => {
          if (editingField && template) {
            const updatedField = {
              ...editedValues[editingField],
              config: data,
            };
            setEditedValues((prev) => ({
              ...prev,
              [editingField]: updatedField,
            }));

            const updatedFields = { ...template.fields };
            updatedFields[editingField] = updatedField;
          }
          setIsFieldModalOpen(false);
        }}
        fieldType={
          (editingField &&
            (editedValues[editingField]?.type as TYPE_OPTIONS)) ||
          TYPE_OPTIONS.TEXT
        }
        initialConfig={fieldModalConfig}
        testId="template-detail.field-modal"
      />
    </div>
  );
};

GlobalCore.manager.app("template-detail", TemplateDetail);
