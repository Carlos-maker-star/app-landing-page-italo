import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WhatsappService } from '../core/whatsapp.service';
import { IconoProducto } from '../shared/icono-producto';

@Component({
  selector: 'app-categorias',
  imports: [IconoProducto],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="categorias" class="mx-auto max-w-6xl px-4 py-20">
      <span class="bars mb-3"><i></i><i></i><i></i></span>
      <h2 class="display text-2xl md:text-3xl">Categorías</h2>
      <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        @for (c of categorias; track c.nombre) {
          <a href="#catalogo" class="flex aspect-square flex-col justify-between rounded-md border border-line bg-surface p-4 transition sm:p-6 hover:-translate-y-1 hover:border-brand">
            <app-icono-producto [categoria]="c.icono" [tamano]="44" color="#FF4A00" [trazo]="1.4" />
            <div>
              <div class="display break-words text-[.7rem] sm:text-sm">{{ c.nombre }}</div>
              <div class="mt-1 text-xs text-mute">{{ c.nota }}</div>
            </div>
          </a>
        }
        <a [href]="wa.url()" target="_blank" rel="noopener" class="flex aspect-square flex-col justify-between rounded-md border border-brand bg-brand p-4 text-ink transition sm:p-6 hover:-translate-y-1">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>
          <div>
            <div class="display text-[.7rem] sm:text-sm">A pedido</div>
            <div class="mt-1 text-xs">¿Buscas algo específico?</div>
          </div>
        </a>
      </div>
    </section>
  `,
})
export class Categorias {
  protected readonly wa = inject(WhatsappService);
  protected readonly categorias = [
    { nombre: 'Zapatillas', nota: 'Nike, Adidas, Jordan…', icono: 'zapatilla' },
    { nombre: 'Ropa', nota: 'Streetwear y marcas', icono: 'ropa' },
    { nombre: 'iPhones', nota: 'Y tecnología', icono: 'iphone' },
  ];
}
