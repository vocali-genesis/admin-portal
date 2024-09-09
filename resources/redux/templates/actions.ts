import { GenesisTemplate } from "@/core/module/core.types";
import Service from "@/core/module/service.factory";
import { Dispatch } from "redux";

export const setTemplates = (templates: GenesisTemplate[]) => ({
  type: "SET_TEMPLATES" as const,
  payload: { templates },
});

export const setPagination = (pagination: {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}) => ({
  type: "SET_PAGINATION" as const,
  payload: { pagination },
});

export const fetchTemplates = async (
  dispatch: Dispatch<TemplateActionTypes>,
  limit?: number,
  currentPage?: number,
) => {
  const response = await Service.require("templates").getTemplates();
  if (!response) return;

  dispatch(setTemplates(response));
  dispatch(
    setPagination({
      currentPage: currentPage || 1,
      totalPages: limit ? Math.ceil(response.length / limit) : 1,
      totalRecords: response.length,
    }),
  );
};

export type TemplateActionTypes =
  | ReturnType<typeof setTemplates>
  | ReturnType<typeof setPagination>;
