import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supbaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseURL, supbaseAnonKey);

export default supabase;