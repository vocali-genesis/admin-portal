import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import templateService, {
  Template,
  TemplateField,
} from "@/services/genesis/templates.service";
import template_edit_styles from "./styles/template-edit.module.css";
import MessageHandler from "@/core/message-handler";

const messageHandler = MessageHandler.get();

const EditTemplate = () => {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTemplateDetails();
    }
  }, [id]);

  const fetchTemplateDetails = async () => {
    setIsLoading(true);
    try {
      const data = await templateService.getTemplate(Number(id));
      setTemplate(data);
    } catch (error) {
      console.error("Error fetching template details:", error);
      messageHandler.handleError("Failed to load template details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (key: string, field: string, value: string) => {
    if (template) {
      setTemplate({
        ...template,
        fields: {
          ...template.fields,
          [key]: {
            ...template.fields[key],
            [field]: value,
          },
        },
      });
    }
  };

  const handleSave = async () => {
    if (template) {
      try {
        await templateService.updateTemplate(template.id, template);
        messageHandler.handleSuccess("Template updated successfully");
        router.push(`/app/templates/detail/${id}`);
      } catch (error) {
        console.error("Error updating template:", error);
        messageHandler.handleError("Failed to update template");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className={template_edit_styles.container}>
      <div className={template_edit_styles.header}>
        <h1 className={template_edit_styles.title}>Edit Template</h1>
        <button
          className={template_edit_styles.saveButton}
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
      <table className={template_edit_styles.table}>
        <thead className={template_edit_styles.tableHeader}>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tbody className={template_edit_styles.tableBody}>
          {Object.entries(template.fields).map(
            ([key, field]: [string, TemplateField]) => (
              <tr key={key}>
                <td>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) =>
                      handleFieldChange(key, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleFieldChange(key, "type", e.target.value)
                    }
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={field.description}
                    onChange={(e) =>
                      handleFieldChange(key, "description", e.target.value)
                    }
                  />
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

GlobalCore.manager.app("edit-template", EditTemplate);
