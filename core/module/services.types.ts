import {
  GenesisOauthProvider,
  GenesisUser,
  GenesisTemplate,
} from "./core.types";
import { PaginatedResponse } from "@/services/templates/templates.service";

export type ComponentName =
  | "subscriptions"
  | "recording"
  | "auth"
  | "templates";
export type ServiceName =
  | "oauth"
  | "medical-api"
  | "subscriptions"
  | "templates";

export type ServiceInterface<T extends ServiceName> = T extends "oauth"
  ? AuthService
  : T extends "medical-api"
    ? MedicalTranscription
    : T extends "templates"
      ? TemplateService
      : T extends "subscriptions"
        ? SubscriptionService
        : never;

export type CENTS = number & { __brand: "cents" }; // 100 => 1.00
export function centsToNumber(value: CENTS): number {
  return value / 100;
}

export type InvoiceResponse = {
  invoice_id: string;
  created_at: string;
  amount: CENTS;
  invoice_url: string;
};
export type SubscriptionResponse = Record<string, string | number>;

export interface MedicalTranscription {
  transcribeAudio(audioFile: File): Promise<string>;
  generateReport(
    transcription: string,
    template?: string,
    language?: string,
  ): Promise<string>;
  processAudioAndGenerateReport(
    audioFile: File,
    template?: string,
    language?: string,
  ): Promise<{
    report: string;
    transcription: string;
    time: {
      transcription: number;
      report: number;
    };
  } | null>;
}

export interface AuthService {
  registerUser(
    email: string,
    password: string,
  ): Promise<{ user: GenesisUser | null; token: string | undefined } | null>;
  loginUser(
    email: string,
    password: string,
  ): Promise<{ user: GenesisUser | null; token: string | undefined } | null>;
  oauth(provider: GenesisOauthProvider): Promise<string | null>;
  getLoggedUser(): Promise<GenesisUser | null>;
  logout(): Promise<null | undefined>;
  resetPassword(email: string): Promise<boolean>;
  updateUser(email?: string, password?: string): Promise<GenesisUser | null>;
}

export interface SubscriptionService {
  getSubscriptionLink(): Promise<{ url: string | null }>;
  getActiveSubscription(): Promise<Record<string, string | number>>;
}

export interface TemplateService {
  getTemplates(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResponse<GenesisTemplate> | null>;
  getTemplate(id: number): Promise<GenesisTemplate | null>;
  createTemplate(
    template: Omit<GenesisTemplate, "id" | "createdAt" | "ownerId">,
  ): Promise<GenesisTemplate | null>;
  updateTemplate(
    id: number,
    updates: Partial<GenesisTemplate>,
  ): Promise<GenesisTemplate | null>;
  deleteTemplate(id: number): Promise<boolean>;
}
