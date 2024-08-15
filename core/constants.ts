export enum MODULE {
  DASHBOARD = "dashboard",
  CONFIRM_RESET_PASSWORD = "confirm-reset-password",
}

// export const TYPE_OPTIONS = ["text", "number", "select", "multiselect"];
export enum TYPE_OPTIONS {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  MULTISELECT = "multiselect",
}

export const LANGUAGES = ["en", "es", "ca", "pt"];
export const URLS = {
  APP: `/app/${MODULE.DASHBOARD}`,
};
