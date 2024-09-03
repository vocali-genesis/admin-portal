import {
  GenesisInvoice,
  GenesisOauthProvider,
  GenesisReport,
  GenesisUser,
  GenesisTemplate,
  GenesisPagination,
  SubscriptionResponse,
} from "./core.types";

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
      ? SupabaseTemplateService
      : T extends "subscriptions"
        ? SubscriptionService
        : never;

export interface MedicalTranscription {
  transcribeAudio(audioFile: File): Promise<GenesisReport["transcription"]>;
  processAudioAndGenerateReport(
    audioFile: File,
    template?: GenesisTemplate,
    language?: string,
  ): Promise<GenesisReport | null>;
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
  getSubscriptionLink(): Promise<{ url: string } | null>;
  getManageSubscriptionLink(): Promise<{ url: string } | null>;
  getActiveSubscription(): Promise<SubscriptionResponse | null>;
  getInvoices(
    from: number,
    to: number,
  ): Promise<{ invoices: GenesisInvoice[]; count: number }>;
  cancelSubscription(): Promise<Record<string, string | number> | null>;
}

export interface SupabaseTemplateService {
  getTemplates(
    page: number,
    pageSize?: number,
  ): Promise<GenesisPagination<GenesisTemplate> | null>;
  getTemplate(
    id: string,
    page: number,
    pageSize: number,
  ): Promise<GenesisPagination<GenesisTemplate> | null>;
  createTemplate(
    template: Omit<GenesisTemplate, "id" | "created_at" | "owner_id">,
  ): Promise<GenesisTemplate | null>;
  updateTemplate(
    id: string,
    updates: Partial<GenesisTemplate>,
  ): Promise<GenesisTemplate | null>;
  deleteTemplate(id: string): Promise<boolean>;
}
