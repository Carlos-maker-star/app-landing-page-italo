import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="faq" class="mx-auto max-w-3xl px-4 py-20">
      <span class="bars mb-3"><i></i><i></i><i></i></span>
      <h2 class="display text-2xl md:text-3xl">Preguntas frecuentes</h2>
      <div class="mt-10 divide-y divide-line border-y border-line">
        @for (f of preguntas(); track f.q) {
          <details class="group py-5">
            <summary class="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
              {{ f.q }}
              <span class="text-2xl text-brand transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="mt-3 text-sm text-mute">{{ f.a }}</p>
          </details>
        }
      </div>
    </section>
  `,
})
export class Faq {
  private readonly catalogo = inject(CatalogoService);

  protected preguntas() {
    const ciudad = this.catalogo.config().ciudad || 'tu ciudad';
    const adelanto = this.catalogo.config().adelanto_pct;
    return [
      { q: '¿Cuánto demora mi pedido?', a: 'Depende del producto y del país de origen. Te damos el tiempo exacto al cotizar.' },
      { q: '¿Los productos son originales?', a: 'Sí, todos son 100% originales y comprados en tiendas oficiales.' },
      { q: '¿Cómo pago?', a: `Pagas en dos partes: ${adelanto}% para separar tu pedido y ${100 - adelanto}% cuando lo recibes.` },
      { q: '¿Hacen entregas a domicilio?', a: `Sí, dentro de ${ciudad}. También puedes retirar en un punto acordado.` },
    ];
  }
}
