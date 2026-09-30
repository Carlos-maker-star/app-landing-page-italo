import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-confianza',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grain bg-brand text-ink">
      <ul class="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 text-center text-xs font-semibold uppercase tracking-widest md:grid-cols-4 md:text-sm">
        <li>Productos originales</li>
        <li>Envíos seguros</li>
        <li>Pago protegido</li>
        <li>Seguimiento de tu pedido</li>
      </ul>
    </section>
  `,
})
export class Confianza {}
