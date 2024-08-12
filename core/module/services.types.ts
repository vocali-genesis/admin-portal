import { GenesisOauthProvider, GenesisUser } from "./core.types";
import { Template, PaginatedResponse } from "@/services/templates/templates.service";

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
    : // TODO
      T extends "templates"
      ? TemplateService
      : T extends "subscriptions"
        ? SubscriptionService
        : never;

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
  resetPassword(email: string): Promise<{} | null>;
  updateUser(email?: string, password?: string): Promise<GenesisUser | null>;
}

export interface SubscriptionService {
  getSubscriptionLink(): Promise<{ url: string | null }>;
  getActiveSubscription(): Promise<Record<string, string | number>>;
}

export interface TemplateService {
  getTemplates(page: number, pageSize: number): Promise<PaginatedResponse<Template> | null>
  getTemplate(id: number): Promise<Template | null>;
  createTemplate(
    template: Omit<Template, "id" | "createdAt" | "ownerId">,
  ): Promise<Template | null>;
  updateTemplate(
    id: number,
    updates: Partial<Template>,
  ): Promise<Template | null>;
  deleteTemplate(id: number): Promise<boolean>;
}
