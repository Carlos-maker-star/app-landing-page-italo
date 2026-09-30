import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase.client';

/** Sesión del administrador con Supabase Auth. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly sesion = signal<Session | null>(null);
  /** true cuando ya se leyó la sesión guardada (evita un parpadeo al login al recargar). */
  readonly listo = signal(false);

  readonly autenticado = computed(() => this.sesion() !== null);
  readonly email = computed(() => this.sesion()?.user.email ?? '');
  readonly nombre = computed(() => this.email().split('@')[0]);

  private iniciado: Promise<void> | null = null;

  /** Lee la sesión guardada y escucha cambios (cierre, renovación de token). */
  iniciar(): Promise<void> {
    this.iniciado ??= (async () => {
      const { data } = await supabase().auth.getSession();
      this.sesion.set(data.session);
      this.listo.set(true);
      supabase().auth.onAuthStateChange((_evento, sesion) => this.sesion.set(sesion));
    })();
    return this.iniciado;
  }

  async login(email: string, password: string): Promise<void> {
    const { data, error } = await supabase().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    this.sesion.set(data.session);
  }

  /** Comprueba la contraseña actual (re-autenticando) y luego la cambia. */
  async cambiarPassword(actual: string, nueva: string): Promise<void> {
    const { error: errorActual } = await supabase().auth.signInWithPassword({ email: this.email(), password: actual });
    if (errorActual) throw new Error('La contraseña actual no es correcta.');
    const { error } = await supabase().auth.updateUser({ password: nueva });
    if (error) throw error;
  }

  async logout(): Promise<void> {
    await supabase().auth.signOut();
    this.sesion.set(null);
    await this.router.navigate(['/login']);
  }
}
