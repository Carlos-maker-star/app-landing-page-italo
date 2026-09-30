import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { CatalogoService } from './core/catalogo.service';
import { Catalogo } from './sections/catalogo';
import { Categorias } from './sections/categorias';
import { ComoFunciona } from './sections/como-funciona';
import { Confianza } from './sections/confianza';
import { CtaFinal } from './sections/cta-final';
import { Faq } from './sections/faq';
import { Footer } from './sections/footer';
import { FormasPago } from './sections/formas-pago';
import { Header } from './sections/header';
import { Hero } from './sections/hero';
import { Testimonios } from './sections/testimonios';
import { WhatsappFlotante } from './sections/whatsapp-flotante';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Confianza, Categorias, Catalogo, ComoFunciona, FormasPago, Testimonios, Faq, CtaFinal, Footer, WhatsappFlotante],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main>
      <app-hero />
      <app-confianza />
      <app-categorias />
      <app-catalogo />
      <app-como-funciona />
      <app-formas-pago />
      <app-testimonios />
      <app-faq />
      <app-cta-final />
    </main>
    <app-footer />
    <app-whatsapp-flotante />
  `,
})
export class App {
  constructor() {
    // Los datos se piden solo en el navegador para que siempre estén frescos (el admin los cambia).
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const catalogo = inject(CatalogoService);
    const documento = inject(DOCUMENT);
    void catalogo.cargar();
    // Quien deja la pestaña abierta ve los cambios del admin al volver (como máximo una vez por minuto).
    documento.addEventListener('visibilitychange', () => {
      if (documento.visibilityState === 'visible') void catalogo.refrescar();
    });
  }
}
