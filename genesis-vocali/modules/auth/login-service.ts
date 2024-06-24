import supabase from '@/services/auth/auth-supabase.service';

export async function loginUser(email, password) {
  try {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
