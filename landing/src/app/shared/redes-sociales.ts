import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';
import { facebookUrl, instagramUrl, mailtoUrl, tiktokUrl } from '../core/enlaces';

/** Íconos de redes y correo. Solo aparecen los que el administrador llenó en Configuración. */
@Component({
  selector: 'app-redes-sociales',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enlaces().length) {
      <ul class="flex flex-wrap gap-3">
        @for (e of enlaces(); track e.tipo) {
          <li>
            <a
              [href]="e.url"
              [attr.target]="e.tipo === 'correo' ? null : '_blank'"
              rel="noopener"
              [attr.aria-label]="e.nombre"
              [title]="e.nombre"
              class="flex h-11 w-11 items-center justify-center rounded-full border border-line text-white transition hover:border-brand hover:bg-brand hover:text-ink"
            >
              @switch (e.tipo) {
                @case ('instagram') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                }
                @case ('tiktok') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.6 3c.3 2.3 1.7 3.9 4 4.100v3.200a7.300 7.300 0 0 1-4-1.300v6.100a5.900 5.900 0 1 1-5.900-5.900c.3 0 .6 0 .9.1v3.300a2.700 2.700 0 1 0 1.800 2.500V3z" />
                  </svg>
                }
                @case ('facebook') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 8.500V6.900c0-.8.200-1.200 1.300-1.200H17V2.200C16.600 2.100 15.600 2 14.500 2 12 2 10.300 3.500 10.300 6.200v2.300H7.500v3.600h2.800V22H14V12.100h2.700l.5-3.600z" />
                  </svg>
                }
                @case ('correo') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3.500 7 8.500 6 8.500-6" />
                  </svg>
                }
              }
            </a>
          </li>
        }
      </ul>
    }
  `,
})
export class RedesSociales {
  private readonly cfg = inject(CatalogoService).config;

  protected readonly enlaces = computed(() => {
    const c = this.cfg();
    return [
      { tipo: 'instagram', nombre: 'Instagram', url: instagramUrl(c.instagram) },
      { tipo: 'tiktok', nombre: 'TikTok', url: tiktokUrl(c.tiktok) },
      { tipo: 'facebook', nombre: 'Facebook', url: facebookUrl(c.facebook) },
      { tipo: 'correo', nombre: 'Correo', url: mailtoUrl(c.correo) },
    ].filter((e) => e.url);
  });
}
