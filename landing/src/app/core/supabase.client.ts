import { InjectionToken } from '@angular/core';
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

/** Cliente de Supabase inyectable (en los tests se reemplaza por uno falso). */
export const SUPABASE = new InjectionToken<SupabaseClient>('SUPABASE', { providedIn: 'root', factory: () => supabase() });
