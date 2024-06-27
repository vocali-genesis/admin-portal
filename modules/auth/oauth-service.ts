import supabase from '@/services/auth/auth-supabase.service';
import { Provider } from '@supabase/supabase-js';

// Define the allowed provider names
const validProviders: Provider[] = ['github', 'gitlab', 'google'];

export async function oauthLogin(provider: string) {
  // Validate and convert the string to Provider
  if (!validProviders.includes(provider as Provider)) {
    throw new Error(`Invalid provider: ${provider}`);
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
    });
    if (error) throw error;

    return data;
  } catch (error) {
    console.log(`Oauth login error: ${error}`);
    throw error;
  }
}
