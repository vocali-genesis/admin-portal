import {
  GenesisInvoice,
  GenesisOauthProvider,
  GenesisReport,
  GenesisUser,
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
  : // TODO
  T extends "templates"
  ? never
  : T extends "subscriptions"
  ? SubscriptionService
  : never;

export interface MedicalTranscription {
  transcribeAudio(audioFile: File): Promise<GenesisReport["transcription"]>;
  processAudioAndGenerateReport(
    audioFile: File,
    template?: string,
    language?: string
  ): Promise<GenesisReport | null>;
}

export interface AuthService {
  registerUser(
    email: string,
    password: string
  ): Promise<{ user: GenesisUser | null; token: string | undefined } | null>;
  loginUser(
    email: string,
    password: string
  ): Promise<{ user: GenesisUser | null; token: string | undefined } | null>;
  oauth(provider: GenesisOauthProvider): Promise<string | null>;
  getLoggedUser(): Promise<GenesisUser | null>;
  logout(): Promise<null | undefined>;
  resetPassword(email: string): Promise<boolean>;
  updateUser(email?: string, password?: string): Promise<GenesisUser | null>;
}

export interface SubscriptionService {
  getSubscriptionLink(): Promise<{ url: string | undefined }>;
  getManageSubscriptionLink(): Promise<{ url: string | undefined }>;
  getActiveSubscription(): Promise<SubscriptionResponse | null>;
  getInvoices(
    from: number,
    to: number
  ): Promise<{ invoices: GenesisInvoice[]; count: number }>;
  cancelSubscription(): Promise<Record<string, string | number>>;
}
