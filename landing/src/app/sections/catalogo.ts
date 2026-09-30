import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
          @if (catalogo.categorias().length > 1) {
            <div class="flex flex-wrap gap-2 text-xs uppercase tracking-widest" role="group" aria-label="Filtrar por categoría">
              <button type="button" class="rounded-sm px-4 py-2 transition" [class]="clase(null)" [attr.aria-pressed]="filtro() === null" (click)="filtro.set(null)">Todo</button>
              @for (c of catalogo.categorias(); track c) {
                <button type="button" class="rounded-sm px-4 py-2 transition" [class]="clase(c)" [attr.aria-pressed]="filtro() === c" (click)="filtro.set(c)">{{ c }}</button>
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
          <p class="mt-10 rounded-md border border-dashed border-line p-10 text-center text-mute">
            Estamos actualizando el catálogo. Escríbenos por WhatsApp y te ayudamos a encontrar lo que buscas.
          </p>
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
                  <a [href]="wa.url(p.nombre)" target="_blank" rel="noopener" class="btn btn-ghost mt-auto !py-2.5 !text-[.6rem]">
                    {{ p.agotado ? 'Consultar' : 'Cotizar' }}<span class="hidden sm:inline">&nbsp;por WhatsApp</span>
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
  protected readonly filtro = signal<string | null>(null);

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
