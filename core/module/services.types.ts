import { GenesisOauthProvider, GenesisUser } from "./core.types";

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

type CENTS = number & { __brand: "cents" }; // 100 => 1.00
export function centsToNumber(value: CENTS) {
  return (value / 100) as number;
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
    language?: string
  ): Promise<string>;
  processAudioAndGenerateReport(
    audioFile: File,
    template?: string,
    language?: string
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
  getSubscriptionLink(): Promise<{ url: string | null }>;
  getActiveSubscription(): Promise<SubscriptionResponse>;
  getInvoices(
    from: number,
    to: number
  ): Promise<{ invoices: [InvoiceResponse] | []; count: number }>;
}
