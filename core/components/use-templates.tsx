import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { GenesisTemplate } from "@/core/module/core.types";
import {
  fetchTemplates,
  setPagination,
  setTemplates,
} from "@/resources/redux/templates/actions";
import Service from "@/core/module/service.factory";
import MessageHandler from "@/core/message-handler";
import { useTranslation } from "react-i18next";

export const useTemplates = (limit?: number) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const templateService = Service.require("templates");
  const { templates, hasFetchedTemplates, pagination } = useSelector(
    (state: RootState) => state.templates,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      if (!hasFetchedTemplates) {
        await fetchTemplates(dispatch, limit, pagination.currentPage);
      }

      setIsLoading(false);
    }
    void load();
  }, [dispatch, hasFetchedTemplates, limit, pagination.currentPage]);

  const createTemplate = useCallback(
    async (
      template: Omit<GenesisTemplate, "id" | "owner_id" | "created_at">,
    ) => {
      const createdTemplate = await templateService.createTemplate(template);
      if (!createdTemplate) return;

      dispatch(setTemplates([createdTemplate, ...templates]));
      dispatch(
        setPagination({
          ...pagination,
          totalRecords: pagination.totalRecords + 1,
        }),
      );
    },
    [dispatch, templates, pagination],
  );

  const deleteTemplate = useCallback(
    async (templateId: string) => {
      const resp = await templateService.deleteTemplate(templateId);
      if (!resp) return;

      dispatch(
        setTemplates(
          templates.filter((template) => template.id !== templateId),
        ),
      );

      dispatch(
        setPagination({
          ...pagination,
          totalRecords: pagination.totalRecords - 1,
        }),
      );
    },
    [dispatch, templates, pagination],
  );

  const updateTemplate = useCallback(
    async (editedTemplate: GenesisTemplate) => {
      const savedTemplate = await templateService.updateTemplate(
        editedTemplate.id,
        editedTemplate,
      );

      if (!savedTemplate) {
        MessageHandler.get().handleError(t("templates.updateError"));
        return;
      }

      dispatch(
        setTemplates(
          templates.map((t) => (t.id === savedTemplate.id ? savedTemplate : t)),
        ),
      );
    },
    [dispatch, templates],
  );

  return {
    templates,
    pagination,
    isLoading,
    hasFetchedTemplates,
    setIsLoading,
    createTemplate,
    deleteTemplate,
    updateTemplate,
  };
};
