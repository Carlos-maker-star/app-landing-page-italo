import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

let cliente: SupabaseClient | undefined;

/** Cliente único de Supabase. La sesión del administrador se guarda en localStorage. */
export function supabase(): SupabaseClient {
  cliente ??= createClient(environment.supabaseUrl, environment.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'iseven.admin.sesion' },
  });
  return cliente;
}

/** Convierte el error de Supabase en un texto para mostrar. */
export function mensajeDeError(error: unknown): string {
  const mensaje = (error as { message?: string } | null)?.message ?? '';
  if (/invalid login credentials/i.test(mensaje)) return 'Correo o contraseña incorrectos.';
  if (/row-level security|permission denied|JWT/i.test(mensaje)) return 'No tienes permiso para esta acción. Vuelve a iniciar sesión.';
  if (/different from the old password/i.test(mensaje)) return 'La nueva contraseña debe ser distinta de la actual.';
  if (/weak|easy to guess|pwned/i.test(mensaje)) return 'Esa contraseña es muy fácil de adivinar. Usa una más larga y con números.';
  if (/at least \d+ characters|too short/i.test(mensaje)) return 'La contraseña es demasiado corta.';
  if (/duplicate key|already exists/i.test(mensaje)) return 'Ya existe un registro con ese nombre.';
  if (/failed to fetch|network/i.test(mensaje)) return 'Sin conexión con el servidor. Revisa tu internet.';
  return mensaje || 'Ocurrió un error inesperado.';
}
