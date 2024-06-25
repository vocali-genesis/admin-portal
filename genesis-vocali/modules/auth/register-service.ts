import supabase from '@/services/auth/auth-supabase.service';

export async function registerUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    return {user: data.user, token: data.session?.access_token };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}