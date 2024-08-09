import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import templateService, {
  Template,
  TemplateField,
} from "@/services/genesis/templates.service";
import template_styles from "./styles/template-detail.module.css";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import MessageHandler from "@/core/message-handler";

const messageHandler = MessageHandler.get();

const TemplateDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: { name: string } & Partial<TemplateField>;
  }>({});

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
    setEditedValues({
      ...editedValues,
      [fieldKey]: { name: fieldKey, ...template?.fields[fieldKey] },
    });
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
      console.log(error);
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

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className={template_styles.container}>
      <h1 className={template_styles.title}>{template.name}</h1>
      <p>{template.preview}</p>
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
                    style={{ color: "#319795" }}
                  >
                    <FaSave />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(key)}
                    className={template_styles.actionButton}
                  >
                    <FaEdit />
                  </button>
                )}
                <button className={template_styles.actionButton}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

GlobalCore.manager.app("template-detail", TemplateDetail);
