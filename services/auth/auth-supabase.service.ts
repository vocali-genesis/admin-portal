import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import MessageHandler from "@/core/message-handler";
import { MODULE } from "@/core/constants";
import { GenesisOauthProvider, GenesisUser } from "@/core/module/core.types";
import { GlobalCore } from "@/core/module/module.types";
import { AuthService } from "@/core/module/services.types";
  
const messageHandler = MessageHandler.get()
class SupabaseAuthService implements AuthService {
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
 

 public async oauth(
    provider: GenesisOauthProvider,
  ): Promise<string | null> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/app/${MODULE.DASHBOARD}`,
      },
    });
    if (error) return messageHandler.handleError(error.message);

    return data.url;
  }

  async getLoggedUser(): Promise<GenesisUser | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async logout(): Promise<null | undefined> {
    let { error } = await this.supabase.auth.signOut();
    if (error) return messageHandler.handleError(error.message);
  }

  async resetPassword(email: string): Promise<{} | null> {
    let { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/${MODULE.CONFIRM_RESET_PASSWORD}`,
      },
    );
    if (error) return messageHandler.handleError(error.message);

    return data;
  }

  async updateUser(email?: string, password?: string): Promise<User | null> {
    const { data, error } = await this.supabase.auth.updateUser({
      email,
      password,
    });
    if (error) return messageHandler.handleError(error.message);

    return data.user;
  }
}


GlobalCore.manager.service("oauth", new SupabaseAuthService());
