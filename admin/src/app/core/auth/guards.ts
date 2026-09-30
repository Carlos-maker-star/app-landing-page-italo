import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Las dependencias se piden ANTES del primer await: después ya no hay contexto de inyección.

/** Rutas privadas: sin sesión, al login. Espera a que se lea la sesión guardada. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.iniciar();
  return auth.autenticado() || router.createUrlTree(['/login']);
};

/** Login: con sesión, al dashboard. */
export const invitadoGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.iniciar();
  return !auth.autenticado() || router.createUrlTree(['/dashboard']);
};
