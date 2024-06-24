import supabase from '@/services/auth/auth-supabase.service';

export async function registerUser(email, password) {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}