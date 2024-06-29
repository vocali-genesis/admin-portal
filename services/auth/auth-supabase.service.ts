import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import config from '@/resources/utils/config';

class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async registerUser(email: string, password: string): Promise<{ user: User | null; token: string | undefined }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    
    return { user: data.user, token: data.session?.access_token };
  }

  async loginUser(email: string, password: string): Promise<{ user: User | null; token: string | undefined }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  
    return { user: data.user, token: data.session?.access_token };
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}

export default new AuthService();