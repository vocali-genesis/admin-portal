import supabase from '@/services/auth/auth-supabase.service';

export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return {user: data.user, token: data.session?.access_token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
