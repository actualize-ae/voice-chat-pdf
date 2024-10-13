import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

export class SupabaseAuth {
  supabaseAuth: SupabaseAuthClient;
  supabase: SupabaseClient;
  constructor() {
    this.supabaseAuth = supabase.auth;
    this.supabase = supabase;
  }
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await this.supabaseAuth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabaseAuth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const { data, error } = await this.supabaseAuth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        throw error;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  }
}

export const supabseAuthClient = new SupabaseAuth();
