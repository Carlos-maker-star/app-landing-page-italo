import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';
import { WhatsappService } from '../core/whatsapp.service';

/** Textos de relleno: reemplazar por testimonios y capturas reales del cliente antes de publicar. */
@Component({
  selector: 'app-testimonios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="border-y border-line bg-surface">
      <div class="mx-auto max-w-6xl px-4 py-20">
        <span class="bars mb-3"><i></i><i></i><i></i></span>
        <h2 class="display text-2xl md:text-3xl">Clientes que ya recibieron</h2>
        <div class="mt-10 grid gap-4 md:grid-cols-3">
          @for (t of testimonios; track t.autor) {
            <figure class="rounded-md border border-line bg-ink p-6">
              <div class="mb-3 text-brand" aria-label="5 de 5 estrellas">★★★★★</div>
              <blockquote class="text-sm text-mute">“{{ t.texto }}”</blockquote>
              <figcaption class="mt-4 text-sm font-semibold">
                {{ t.autor }}
                @if (catalogo.config().ciudad) { <span class="font-normal text-mute">· {{ catalogo.config().ciudad }}</span> }
              </figcaption>
            </figure>
          }
          <div class="flex flex-col items-center justify-center gap-4 rounded-md border border-brand/40 bg-ink p-6 text-center">
            <p class="m-0 text-sm text-mute">¿Buscas algo en especial? Te lo conseguimos y te lo entregamos en tu ciudad.</p>
            <a [href]="wa.url()" target="_blank" rel="noopener" class="btn btn-primary whitespace-nowrap">Escríbenos ahora</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Testimonios {
  protected readonly catalogo = inject(CatalogoService);
  protected readonly wa = inject(WhatsappService);
  protected readonly testimonios = [
    { autor: 'Gabriel Arenas', texto: 'Llegaron mis Jordan en el tiempo que me dijeron. Originales y bien empacadas.' },
    { autor: 'Carlos Rivadeneyra', texto: 'Me consiguieron el iPhone que no encontraba en tiendas. Excelente atención.' },
  ];
}
