import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard, invitadoGuard } from './guards';

function preparar(autenticado: boolean) {
  const auth = { iniciar: () => Promise.resolve(), autenticado: signal(autenticado) };
  TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: auth }] });
}

const ejecutar = (guard: typeof authGuard) => TestBed.runInInjectionContext(() => guard({} as never, {} as never));

describe('guards', () => {
  it('authGuard deja pasar con sesión', async () => {
    preparar(true);
    expect(await ejecutar(authGuard)).toBe(true);
  });

  it('authGuard manda al login sin sesión', async () => {
    preparar(false);
    const r = (await ejecutar(authGuard)) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(r)).toBe('/login');
  });

  it('invitadoGuard manda al dashboard si ya hay sesión', async () => {
    preparar(true);
    const r = (await ejecutar(invitadoGuard)) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(r)).toBe('/dashboard');
  });
});
