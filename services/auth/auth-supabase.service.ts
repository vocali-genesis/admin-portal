import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
<<<<<<< HEAD
import { Provider } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import messageHandler from "@/core/message-handler";
import { MODULE } from "@/core/constants";
=======
import { Provider } from '@supabase/supabase-js';
import config from "@/resources/utils/config";
import errorHandler from "@/core/error-handler";
>>>>>>> f4a2b5d (Updated auth service and register and login forms)

class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async registerUser(
    email: string,
    password: string,
  ): Promise<{ user: User | null; token: string | undefined } | null> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) return messageHandler.handleError(error.message);

    return { user: data.user, token: data.session?.access_token };
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ user: User | null; token: string | undefined } | null> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return messageHandler.handleError(error.message);

    return { user: data.user, token: data.session?.access_token };
  }

  async oauth(
    provider: Provider,
  ): Promise<{ provider: Provider; url: string } | null> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/app/${MODULE.DASHBOARD}`,
      },
    });
    if (error) return messageHandler.handleError(error.message);

    return data;
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}

export default new AuthService();
