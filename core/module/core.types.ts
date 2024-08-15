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

export type GenesisInvoice = {
  invoice_id: string;
  created_at: string;
  amount: CENTS;
  invoice_url: string;
};

export interface GenesisTemplateField {
    type: "text" | "number" | "multiselect";
    description: string;
    options?: string[];
}

export interface GenesisTemplate {
    id: number;
    ownerId: string;
    name: string;
    createdAt: string;
    preview: string;
    fields: { [key: string]: GenesisTemplateField };
}
