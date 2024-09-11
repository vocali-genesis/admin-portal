/**
 * Basic User Model common to all the Auth providers
 */
export interface GenesisUser {
  id: string;
  created_at: string;
  email?: string;
  email_confirmed_at?: string;
}

/**
 * Add new providers as we accept more
 * Each auth service need to launch an error if a provider
 * requested can not be handled
 */
export type GenesisOauthProvider = "google" | "facebook";

export type CENTS = number & { __brand: "cents" }; // 100 => 1.00
export function centsToNumber(value: CENTS): number {
  return value / 100;
}

export type GenesisInvoice = {
  invoice_id: string;
  created_at: string;
  amount: CENTS;
  invoice_url: string;
  metadata: Record<string, number | string>;
};

export enum TYPE_OPTIONS {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  MULTISELECT = "multiselect",
}
export interface NumberFieldConfig {
  maxValue: number;
}

export interface SelectFieldConfig {
  options: string[];
}

export type FieldConfig = NumberFieldConfig | SelectFieldConfig;
export type FieldData = { maxValue: number } | { options: string[] };
export interface GenesisTemplateField {
  type: TYPE_OPTIONS;
  description: string;
  config?: FieldConfig;
}

export interface GenesisTemplate {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  preview: string;
  fields: { [key: string]: GenesisTemplateField };
}

export type GenesisSubscription = {
  current_period_end: string;
  current_period_start: string;
  id: string;
  status: string;
  subscription_id: string;
};

export type GenesisReport = {
  report: Record<string, string>;
  transcription: string[];
  time: {
    transcription: number;
    report: number;
  };
};

// Refactor, we only need the count, not the page
export type GenesisPagination<T> = {
  data: T[];
  totalCount: number;
  totalPages: number;
};
