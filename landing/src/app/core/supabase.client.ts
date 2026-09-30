import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

let cliente: SupabaseClient | undefined;

/** Cliente único de Supabase (clave publicable: la seguridad la da RLS). */
export function supabase(): SupabaseClient {
  cliente ??= createClient(environment.supabaseUrl, environment.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}
