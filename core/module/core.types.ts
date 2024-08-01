/**
 * Basic User Model common to all the Auth providers
 */
export interface GenesisUser {
    id: string
    created_at: string
    email?: string
    email_confirmed_at?: string
 }

 
/**
 * Add new providers as we accept more
 * Each auth service need to launch an error if a provider 
 * requested can not be handled
 */
 export type GenesisOauthProvider =
  | 'google'
  | 'facebook'
   