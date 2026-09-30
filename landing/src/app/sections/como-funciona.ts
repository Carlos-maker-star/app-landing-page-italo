import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-como-funciona',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="como" class="mx-auto max-w-6xl px-4 py-20">
      <span class="bars mb-3"><i></i><i></i><i></i></span>
      <h2 class="display text-2xl md:text-3xl">Cómo funciona</h2>
      <ol class="mt-12 grid gap-6 md:grid-cols-4">
        @for (p of pasos; track p.n; let primero = $first) {
          <li class="border-t-2 pt-5" [class]="primero ? 'border-brand' : 'border-line'">
            <div class="display text-2xl" [class]="primero ? 'text-brand' : 'text-mute'">{{ p.n }}</div>
            <h3 class="mt-3 font-semibold">{{ p.titulo }}</h3>
            <p class="mt-2 text-sm text-mute">{{ p.texto }}</p>
          </li>
        }
      </ol>
    </section>
  `,
})
export class ComoFunciona {
  protected readonly pasos = [
    { n: '01', titulo: 'Elige tu producto', texto: 'Del catálogo o envíanos el link de lo que buscas.' },
    { n: '02', titulo: 'Te cotizamos', texto: 'Precio final y tiempos por WhatsApp, sin sorpresas.' },
    { n: '03', titulo: 'Lo importamos', texto: 'Compramos y traemos tu pedido con seguimiento.' },
    { n: '04', titulo: 'Lo recibes', texto: 'Entrega en tu ciudad, a domicilio o retiro.' },
  ];
}
