import { createClient } from '@supabase/supabase-js';

// Read credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw an error if the variables are not set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required in your .env file.');
}

// Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
