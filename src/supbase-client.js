import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://mjsaxrnpxitifolxedlr.supabase.co";
const supbaseAnonKey = import.meta.env.local.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseURL, supbaseAnonKey);
