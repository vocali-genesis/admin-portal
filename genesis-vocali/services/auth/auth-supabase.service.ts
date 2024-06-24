import { createClient } from '@supabase/js';
import config from '@/resources/config';

const supabaseUrl = config.SUPABASE_URL;
const supabaseAnonKey = config.SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);