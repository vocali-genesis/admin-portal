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
  ? never
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
  ): Promise<{ report: string; transcription: string } | null>;
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
