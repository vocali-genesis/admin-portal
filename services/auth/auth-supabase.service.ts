import { createClient } from "@supabase/supabase-js";
import config from "@/resources/utils/config";

const supabaseUrl = config.SUPABASE_URL;
const supabaseAnonKey = config.SUPABASE_API_KEY;

export default createClient(supabaseUrl, supabaseAnonKey);
