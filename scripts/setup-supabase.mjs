import { createClient } from "@supabase/supabase-js";

export * from './setup-supabase-bucket.mjs'
export * from './setup-supabase-db.mjs'

export const createSupabaseClient = (supabaseUrl, supabaseAnonKey) => createClient(supabaseUrl, supabaseAnonKey)

