import { GenesisTemplate } from "@/core/module/core.types";

export interface TemplatesState {
  templates: GenesisTemplate[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
  hasFetchedTemplates: boolean;
}

const initialState: TemplatesState = {
  templates: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
  },
  hasFetchedTemplates: false,
};

const templatesReducer = (
  state = initialState,
  action: any
): TemplatesState => {
  switch (action.type) {
    case "SET_TEMPLATES":
      return {
        ...state,
        templates: action.payload.templates,
        hasFetchedTemplates: true,
      };
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: action.payload.pagination,
      };
    case "SET_HAS_FETCHED_TEMPLATES":
      return {
        ...state,
        hasFetchedTemplates: action.payload.hasFetchedTemplates,
      }
    default:
      return state;
  }
};

export default templatesReducer;
