import { GenesisOauthProvider, GenesisUser } from "./core.types";

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
  transcribeAudio(audioFile: File): Promise<string>;
  generateReport(
    transcription: string,
    template?: string,
    language?: string
  ): Promise<string>;
  processAudioAndGenerateReport(
    audioFile: File,
    template?: string,
    language?: string
  ): Promise<{
    report: string; transcription: string, time: {
      transcription: number,
      report: number,
    }
  } | null>;
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
  resetPassword(email: string): Promise<{} | null>;
  updateUser(email?: string, password?: string): Promise<GenesisUser | null>;
}

export interface SubscriptionService {
  getSubscriptionLink(): Promise<{ url: string | null }>
  getActiveSubscription(): Promise<Record<string, string|number>>
  getInvoices(from: number, to: number): Promise<{ invoices: [Record<string, string | number>] | [], count: number}>
}