import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';

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
          <div class="flex items-center justify-center rounded-md border border-dashed border-line p-6 text-center text-sm text-mute">
            Aquí van capturas de chats<br />y fotos de entregas reales
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Testimonios {
  protected readonly catalogo = inject(CatalogoService);
  protected readonly testimonios = [
    { autor: 'Cliente 1', texto: 'Llegaron mis Jordan en el tiempo que me dijeron. Originales y bien empacadas.' },
    { autor: 'Cliente 2', texto: 'Me consiguieron el iPhone que no encontraba en tiendas. Excelente atención.' },
  ];
}
