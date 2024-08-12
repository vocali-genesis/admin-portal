import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import templateService, {
  Template,
  TemplateField,
} from "@/services/genesis/templates.service";
import template_styles from "./styles/template-detail.module.css";
import { FaEdit, FaSave, FaTrash, FaArrowLeft, FaPlus } from "react-icons/fa";
import MessageHandler from "@/core/message-handler";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import { useTranslation } from "react-i18next";

const messageHandler = MessageHandler.get();

const TemplateDetail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: { name: string } & TemplateField;
  }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const typeOptions = [
    "string",
    "number",
    "boolean",
    "object",
    "array",
    "date",
  ];

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    if (typeof id === "string") {
      try {
        const fetchedTemplate = await templateService.getTemplate(parseInt(id));
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate);
        } else {
          messageHandler.handleError("Template not found");
        }
      } catch (error) {
        messageHandler.handleError("Failed to fetch template");
      }
    }
  };

  const handleEdit = (fieldKey: string) => {
    setEditingField(fieldKey);
    const field = template?.fields[fieldKey];
    if (field) {
      setEditedValues({
        ...editedValues,
        [fieldKey]: { name: fieldKey, ...field },
      });
    }
  };

  const handleSave = async (fieldKey: string) => {
    if (!template) return;

    try {
      const { name, ...fieldData } = editedValues[fieldKey];
      const updatedFields = { ...template.fields };

      if (name !== fieldKey) {
        delete updatedFields[fieldKey];
        updatedFields[name] = fieldData;
      } else {
        updatedFields[fieldKey] = fieldData;
      }

      const updatedTemplate = await templateService.updateTemplate(
        template.id,
        {
          fields: updatedFields,
        },
      );

      if (updatedTemplate) {
        setTemplate(updatedTemplate);
        setEditingField(null);
        setEditedValues({});
        messageHandler.handleSuccess("Template field updated successfully");
      } else {
        messageHandler.handleError("Failed to update template field");
      }
    } catch (error) {
      messageHandler.handleError("Failed to update template field");
    }
  };

  const handleInputChange = (
    fieldKey: string,
    property: string,
    value: string,
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
    const updatedFields = {
      ...template.fields,
      [newFieldKey]: {
        type: "string",
        description: "New field description",
      },
    };

    templateService
      .updateTemplate(template.id, { fields: updatedFields })
      .then((updatedTemplate) => {
        if (updatedTemplate) {
          setTemplate(updatedTemplate);
          messageHandler.handleSuccess("New field added successfully");
        } else {
          messageHandler.handleError("Failed to add new field");
        }
      })
      .catch(() => {
        messageHandler.handleError("Failed to add new field");
      });
  };

  const handleDeleteField = (fieldKey: string) => {
    setFieldToDelete(fieldKey);
    setIsDeleteModalOpen(true);
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
        messageHandler.handleSuccess("Field deleted successfully");
      } else {
        messageHandler.handleError("Failed to delete field");
      }
    } catch (error) {
      messageHandler.handleError("Failed to delete field");
    }

    setIsDeleteModalOpen(false);
    setFieldToDelete(null);
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className={template_styles.container}>
      <div className={template_styles.header}>
        <button
          onClick={() => router.push("/app/templates")}
          className={template_styles.backButton}
        >
          <FaArrowLeft /> {t("recording.back")}
        </button>
        <button
          onClick={handleAddField}
          className={template_styles.addFieldButton}
        >
          <FaPlus /> {t("recording.add_field")}
        </button>
      </div>
      <h1 className={template_styles.title}>{template.name}</h1>
      <p className={template_styles.p}>{template.preview}</p>

      <table className={template_styles.table}>
        <thead className={template_styles.tableHeader}>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={template_styles.tableBody}>
          {Object.entries(template.fields).map(([key, field]) => (
            <tr key={key}>
              <td>
                {editingField === key ? (
                  <input
                    type="text"
                    value={editedValues[key]?.name || key}
                    onChange={(e) =>
                      handleInputChange(key, "name", e.target.value)
                    }
                    className={template_styles.input}
                  />
                ) : (
                  key
                )}
              </td>
              <td>
                {editingField === key ? (
                  <select
                    value={editedValues[key]?.type || field.type}
                    onChange={(e) =>
                      handleInputChange(key, "type", e.target.value)
                    }
                    className={template_styles.input}
                  >
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  field.type
                )}
              </td>
              <td>
                {editingField === key ? (
                  <input
                    type="text"
                    value={editedValues[key]?.description || field.description}
                    onChange={(e) =>
                      handleInputChange(key, "description", e.target.value)
                    }
                    className={template_styles.input}
                  />
                ) : (
                  field.description
                )}
              </td>
              <td>
                {editingField === key ? (
                  <button
                    onClick={() => handleSave(key)}
                    className={`${template_styles.actionButton}`}
                    style={{ color: "var(--primary)" }}
                  >
                    <FaSave />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(key)}
                    className={template_styles.actionButton}
                  >
                    <FaEdit style={{ color: "var(--primary)" }} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteField(key)}
                  className={template_styles.actionButton}
                >
                  <FaTrash style={{ color: "#e53e3e" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

GlobalCore.manager.app("template-detail", TemplateDetail);
