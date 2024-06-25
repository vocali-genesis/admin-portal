import { createClient } from "@supabase/supabase-js";
import config from "@/resources/utils/config";

const supabaseUrl = (config.SUPABASE_URL) as string;
const supabaseAnonKey = (config.SUPABASE_API_KEY) as string;

export default createClient(supabaseUrl, supabaseAnonKey);
