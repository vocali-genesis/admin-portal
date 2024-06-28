import supabase from '@/services/auth/auth-supabase.service';
import { Provider } from '@supabase/supabase-js';

export async function oauth(provider: Provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/app/dashboard`
      }
    });
    if (error) throw error;

    return data;
  } catch (error) {
    console.log(`Oauth login error: ${error}`);
    throw error;
  }
}
