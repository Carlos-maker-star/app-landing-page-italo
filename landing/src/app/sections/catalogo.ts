import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';
import { urlHttps } from '../core/enlaces';
import { formatearPrecio } from '../core/precio';
import { WhatsappService } from '../core/whatsapp.service';
import { IconoProducto } from '../shared/icono-producto';

@Component({
  selector: 'app-catalogo',
  imports: [IconoProducto],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="catalogo" class="border-y border-line bg-surface">
      <div class="mx-auto max-w-6xl px-4 py-20">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span class="bars mb-3"><i></i><i></i><i></i></span>
            <h2 class="display text-2xl md:text-3xl">Productos destacados</h2>
          </div>
          @if (catalogo.categorias().length > 0) {
            <div class="flex flex-wrap gap-2 text-xs uppercase tracking-widest" role="group" aria-label="Filtrar por categoría">
              <button type="button" class="rounded-sm px-4 py-2 transition" [class]="clase(null)" [attr.aria-pressed]="filtro() === null" (click)="filtro.set(null)">Todo</button>
              @for (c of catalogo.categorias(); track c.id) {
                <button type="button" class="rounded-sm px-4 py-2 transition" [class]="clase(c.nombre)" [attr.aria-pressed]="filtro() === c.nombre" (click)="filtro.set(c.nombre)">{{ c.nombre }}</button>
              }
            </div>
          }
        </div>
        <p class="mt-4 text-sm text-mute">Precios referenciales. Confirma disponibilidad y precio final por WhatsApp.</p>

        @if (catalogo.cargando()) {
          <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4" aria-busy="true">
            @for (n of [1, 2, 3, 4]; track n) {
              <div class="aspect-[3/4] animate-pulse rounded-md border border-line bg-ink"></div>
            }
          </div>
        } @else if (visibles().length === 0) {
          <div class="mt-10 flex flex-col items-center gap-4 rounded-md border border-dashed border-line p-10 text-center text-mute">
            @if (filtro(); as cat) {
              <p class="m-0">Por ahora no hay {{ cat }} en el catálogo, pero podemos traértelo por encargo.</p>
              <a [href]="wa.url(cat)" target="_blank" rel="noopener" class="btn btn-primary">Pedir {{ cat }} por WhatsApp</a>
            } @else {
              <p class="m-0">Estamos actualizando el catálogo. Escríbenos por WhatsApp y te ayudamos a encontrar lo que buscas.</p>
            }
          </div>
        } @else {
          <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            @for (p of visibles(); track p.id) {
              <article class="flex flex-col overflow-hidden rounded-md border border-line bg-ink transition hover:-translate-y-1 hover:border-brand">
                <div class="relative flex aspect-square items-center justify-center bg-gradient-to-br from-[#1f1f23] to-[#0f0f11]">
                  @if (imagen(p.imagen_url); as foto) {
                    <img [src]="foto" [alt]="p.nombre" loading="lazy" width="400" height="400" class="h-full w-full object-cover" />
                  } @else {
                    <app-icono-producto [categoria]="p.categoria" />
                  }
                  @if (p.agotado) {
                    <span class="absolute left-3 top-3 rounded-sm bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">Agotado</span>
                  } @else if (p.etiqueta) {
                    <span class="absolute left-3 top-3 rounded-sm bg-brand px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">{{ p.etiqueta }}</span>
                  }
                </div>
                <div class="flex flex-1 flex-col gap-1 p-4">
                  <span class="text-[10px] uppercase tracking-widest text-mute">{{ p.categoria }}</span>
                  <h3 class="text-sm font-semibold">{{ p.nombre }}</h3>
                  <div class="display mb-3 mt-1 text-sm text-brand">{{ precio(p.precio, p.moneda) }}</div>
                  <a
                    [href]="wa.url(p.nombre)"
                    target="_blank"
                    rel="noopener"
                    [attr.aria-label]="(p.agotado ? 'Consultar ' : 'Cotizar ') + p.nombre + ' por WhatsApp'"
                    class="btn btn-ghost mt-auto whitespace-nowrap !py-2.5 !text-[.6rem]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4.1-4.7-4.3-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" />
                    </svg>
                    {{ p.agotado ? 'Consultar' : 'Cotizar' }}
                  </a>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class Catalogo {
  protected readonly catalogo = inject(CatalogoService);
  protected readonly wa = inject(WhatsappService);
  protected readonly filtro = this.catalogo.categoriaActiva;

  protected readonly visibles = computed(() => {
    const f = this.filtro();
    return f ? this.catalogo.productos().filter((p) => p.categoria === f) : this.catalogo.productos();
  });

  protected readonly precio = formatearPrecio;
  protected readonly imagen = urlHttps;

  protected clase(valor: string | null): string {
    return this.filtro() === valor
      ? 'bg-brand text-ink font-semibold'
      : 'border border-line text-mute hover:text-white';
  }
}
