import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';
import { WhatsappService } from '../core/whatsapp.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (catalogo.config().anuncio) {
      <div class="bg-brand px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-ink">
        {{ catalogo.config().anuncio }}
      </div>
    }
    <header class="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <a href="#" class="display text-lg tracking-[.35em]" aria-label="ISEVEN, inicio">ISEVEN</a>
        <nav class="hidden gap-8 text-sm text-mute md:flex" aria-label="Principal">
          @for (e of enlaces; track e.href) {
            <a [href]="e.href" class="hover:text-white">{{ e.texto }}</a>
          }
        </nav>
        <div class="flex items-center gap-2">
          <a [href]="wa.url()" target="_blank" rel="noopener" class="btn btn-primary !px-4 !py-2.5">Cotizar</a>
          <button
            type="button"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-line text-white md:hidden"
            [attr.aria-expanded]="abierto()"
            aria-controls="menu-movil"
            [attr.aria-label]="abierto() ? 'Cerrar menú' : 'Abrir menú'"
            (click)="abierto.set(!abierto())"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              @if (abierto()) {
                <path d="M6 6l12 12M18 6L6 18" />
              } @else {
                <path d="M4 7h16M4 12h16M4 17h16" />
              }
            </svg>
          </button>
        </div>
      </div>
      @if (abierto()) {
        <nav id="menu-movil" class="border-t border-line bg-ink md:hidden" aria-label="Menú móvil">
          @for (e of enlaces; track e.href) {
            <a [href]="e.href" (click)="abierto.set(false)" class="block border-b border-line px-4 py-4 text-sm text-mute last:border-b-0 hover:text-white">{{ e.texto }}</a>
          }
        </nav>
      }
    </header>
  `,
})
export class Header {
  protected readonly catalogo = inject(CatalogoService);
  protected readonly wa = inject(WhatsappService);
  protected readonly abierto = signal(false);
  protected readonly enlaces = [
    { href: '#categorias', texto: 'Categorías' },
    { href: '#catalogo', texto: 'Catálogo' },
    { href: '#como', texto: 'Cómo funciona' },
    { href: '#pagos', texto: 'Pagos' },
    { href: '#faq', texto: 'Preguntas' },
  ];
}
