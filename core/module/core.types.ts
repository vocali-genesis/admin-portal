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
};
export type SubscriptionResponse = Record<string, string | number>;
export type GenesisReport = {
  report: Record<string, string>;
  transcription: string[];
  time: {
    transcription: number;
    report: number;
  };
};
