import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.local.VITE_SUPABASE_URL;
const supbaseAnonKey = import.meta.env.local.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseURL, supbaseAnonKey);
