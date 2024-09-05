import React, { useState } from "react";
import Modal from "react-modal";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
  FieldConfig,
} from "@/core/module/core.types";
import styles from "./new-template-modal.module.css";
import { FaCog, FaTrash } from "react-icons/fa";
import FieldModal from "@/modules/templates/templates/components/field-modal";

Modal.setAppElement("body");

interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    template: Omit<GenesisTemplate, "id" | "owner_id" | "created_at">,
  ) => void;
}

interface FormValues {
  name: string;
  fields: Array<{
    name: string;
    type: TYPE_OPTIONS;
    description: string;
    config?: FieldConfig;
  }>;
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number | null>(
    null,
  );
  const [fieldModalConfig, setFieldModalConfig] = useState<FieldData | null>(
    null,
  );
  const schema = yup.object().shape({
    name: yup.string().required(t("validation.required")),
    fields: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().required(t("validation.required")),
          type: yup
            .mixed<TYPE_OPTIONS>()
            .oneOf(Object.values(TYPE_OPTIONS))
            .required(t("validation.required")),
          description: yup.string().required(t("validation.required")),
          config: yup.mixed<FieldConfig>().optional(),
        }),
      )
      .min(1, t("validation.one-field-required"))
      .required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      fields: [{ name: "", type: TYPE_OPTIONS.TEXT, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const onFormSubmit = (data: FormValues) => {
    const template = {
      name: data.name,
      preview: `Fields: ${data.fields.map((f) => f.name).join(", ")}`,
      fields: data.fields.reduce(
        (acc, field) => {
          acc[field.name] = {
            type: field.type,
            description: field.description,
            config: field.config,
          };
          return acc;
        },
        {} as Record<string, GenesisTemplateField>,
      ),
    };
    onSubmit(template);
    onClose();
    reset();
  };

  const addField = () => {
    append({
      name: `field${fields.length + 1}`,
      type: TYPE_OPTIONS.TEXT,
      description: "",
    });
  };

  const openFieldConfigModal = (index: number) => {
    setCurrentFieldIndex(index);
    const fieldConfig = getValues(`fields.${index}.config`);
    setFieldModalConfig(fieldConfig || null);
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
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div
              className={"flex flex-col h-[10px] mb-2"}
              style={{ marginBottom: "12px" }}
            >
              <BasicInput
                id="template-name"
                {...field}
                placeholder={t("templates.namePlaceholder")}
                testId="templates.new-template-name-input"
                className="w-full"
              />
              {errors.name && (
                <span className={styles.errorMessage}>
                  {errors.name.message}
                </span>
              )}
            </div>
          )}
        />

        {fields.map((field, index) => {
          const fieldType = watch(`fields.${index}.type`);
          return (
            <div key={field.id} className={styles.fieldContainer}>
              <div className={styles.fieldInputs}>
                <Controller
                  name={`fields.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <div className={"flex flex-col"}>
                      <BasicInput
                        id="input-name"
                        {...field}
                        placeholder={t("templates.fieldNamePlaceholder")}
                        className={styles.input}
                        testId="templates.new-template-field-name-input"
                      />
                      {errors.fields?.[index]?.name && (
                        <span className={styles.errorMessage}>
                          {errors.fields?.[index]?.name?.message}
                        </span>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name={`fields.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <BasicSelect
                      {...field}
                      options={Object.values(TYPE_OPTIONS).map((option) => ({
                        value: option,
                        label: t(`templates.type-${option}`),
                      }))}
                    />
                  )}
                />
                <Controller
                  name={`fields.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <BasicInput
                        id="input-description"
                        {...field}
                        placeholder={t("templates.descriptionPlaceholder")}
                        className={styles.input}
                        testId="templates.new-template-field-description-input"
                      />
                      {errors.fields?.[index]?.description && (
                        <span className={styles.errorMessage}>
                          {errors.fields?.[index]?.description?.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className={styles.actionButtons}>
                {fieldType !== TYPE_OPTIONS.TEXT && (
                  <IconButton
                    onClick={(
                      event: React.MouseEvent<HTMLButtonElement> | undefined,
                    ) => {
                      event?.preventDefault();
                      openFieldConfigModal(index);
                    }}
                    size="small"
                    testId="template-detail.edit-field-config"
                  >
                    <FaCog style={{ color: "var(--primary)" }} />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => remove(index)}
                  size="small"
                  testId="template-detail.remove-field"
                >
                  <FaTrash style={{ color: "var(--danger)" }} />
                </IconButton>
              </div>
            </div>
          );
        })}
        <div className="flex sm:flex-col md:flex-row justify-between w-full">
          <Button onClick={addField} testId="add-field-button">
            {t("templates.addField")}
          </Button>
          <Button
            testId="templates.submit-new-template"
            onClick={() => {}}
            type="submit"
          >
            {t("templates.create")}
          </Button>
        </div>
      </form>
      <FieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSave={(data: FieldData) => {
          if (currentFieldIndex !== null) {
            const currentFields = getValues("fields");
            if (currentFields) {
              setValue("fields", [
                ...currentFields.slice(0, currentFieldIndex),
                {
                  ...currentFields[currentFieldIndex],
                  config: data,
                },
                ...currentFields.slice(currentFieldIndex + 1),
              ]);
            }
          }
          setIsFieldModalOpen(false);
        }}
        fieldType={
          currentFieldIndex !== null
            ? getValues(`fields.${currentFieldIndex}.type`)
            : TYPE_OPTIONS.TEXT
        }
        initialConfig={fieldModalConfig}
        testId="new-template-field-modal"
      />
    </Modal>
  );
};

export default NewTemplateModal;
