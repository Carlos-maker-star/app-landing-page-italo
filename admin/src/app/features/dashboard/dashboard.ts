import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ConfiguracionService } from '../../core/configuracion.service';
import { formatearPrecio } from '../../core/etiquetas';
import { Producto } from '../../core/models';
import { ProductosService } from '../../core/productos.service';
import { EstadoBadge } from '../../shared/estado-badge';
import { Miniatura } from '../../shared/miniatura';
import { TiempoRelativoPipe } from '../../shared/tiempo-relativo.pipe';

interface Barra {
  nombre: string;
  cantidad: number;
  ancho: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatButton, MatIcon, EstadoBadge, Miniatura, TiempoRelativoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-1.5">
          <h1 class="display m-0 text-[22px]">Hola, Italo</h1>
          <p class="m-0 text-sm text-muted">Así está tu catálogo hoy.</p>
        </div>
        <a matButton="filled" routerLink="/productos/nuevo"><mat-icon>add</mat-icon>Nuevo producto</a>
      </div>

      @if (error()) {
        <p class="m-0 rounded-md bg-peligro-bg px-4 py-3 text-sm text-peligro-fg" role="alert">{{ error() }}</p>
      }

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        @for (k of kpis(); track k.titulo) {
          <div class="flex flex-col gap-2.5 rounded-lg border border-line bg-surface p-5">
            <div class="flex items-center justify-between text-[13px] font-medium text-muted">
              {{ k.titulo }}
              <span class="flex size-8 items-center justify-center rounded-md" [class]="k.tono"><mat-icon class="icono-sm">{{ k.icono }}</mat-icon></span>
            </div>
            <span class="display text-[26px] tracking-normal">{{ cargando() ? '–' : k.valor }}</span>
            <span class="text-[13px] text-subtle">{{ k.detalle }}</span>
          </div>
        }
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <section class="flex flex-col gap-4 rounded-lg border border-line bg-surface px-6 py-5">
          <h2 class="m-0 text-base font-semibold">Por categoría</h2>
          @for (b of porCategoria(); track b.nombre) {
            <div class="grid grid-cols-[120px_minmax(0,1fr)_32px] items-center gap-3 text-sm">
              <span class="truncate">{{ b.nombre }}</span>
              <div class="h-2.5 overflow-hidden rounded-full bg-track"><span class="block h-full rounded-full bg-primary" [style.width.%]="b.ancho"></span></div>
              <b class="text-right">{{ b.cantidad }}</b>
            </div>
          } @empty {
            <p class="m-0 text-sm text-subtle">Aún no hay productos.</p>
          }
        </section>
        <section class="flex flex-col gap-4 rounded-lg border border-line bg-surface px-6 py-5">
          <h2 class="m-0 text-base font-semibold">Por estado</h2>
          @for (b of porEstado(); track b.nombre) {
            <div class="grid grid-cols-[120px_minmax(0,1fr)_32px] items-center gap-3 text-sm">
              <span class="truncate">{{ b.nombre }}</span>
              <div class="h-2.5 overflow-hidden rounded-full bg-track"><span class="block h-full rounded-full bg-primary" [style.width.%]="b.ancho"></span></div>
              <b class="text-right">{{ b.cantidad }}</b>
            </div>
          }
        </section>
      </div>

      <section class="overflow-hidden rounded-lg border border-line bg-surface">
        <div class="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 class="m-0 text-base font-semibold">Últimos cambios</h2>
          <a routerLink="/productos" class="text-sm font-medium text-primary no-underline hover:underline">Ver todos</a>
        </div>
        @for (p of recientes(); track p.id) {
          <a [routerLink]="['/productos', p.id]" class="flex items-center gap-4 border-b border-line px-6 py-3 text-ink no-underline last:border-b-0 hover:bg-surface-2">
            <app-miniatura [url]="p.imagen_url" [nombre]="p.nombre" />
            <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ p.nombre }}</span>
            <span class="hidden font-mono text-[13px] text-subtle sm:block">{{ precio(p) }}</span>
            <app-estado-badge [producto]="p" />
            <span class="hidden w-28 text-right text-xs text-subtle md:block">{{ p.actualizado_en | tiempoRelativo }}</span>
          </a>
        } @empty {
          <p class="m-0 px-6 py-8 text-center text-sm text-subtle">Todavía no hay productos. Crea el primero.</p>
        }
      </section>
    </div>
  `,
})
export class Dashboard {
  private readonly productosApi = inject(ProductosService);
  private readonly configApi = inject(ConfiguracionService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly maxVisibles = signal(12);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly kpis = computed(() => {
    const lista = this.productos();
    const visibles = lista.filter((p) => p.visible).length;
    const agotados = lista.filter((p) => p.agotado).length;
    const ocultos = lista.filter((p) => !p.visible).length;
    const libres = Math.max(0, this.maxVisibles() - visibles);
    return [
      { titulo: 'Productos', valor: `${lista.length}`, detalle: 'En el catálogo', icono: 'inventory_2', tono: 'bg-primary-soft text-primary' },
      { titulo: 'Visibles en landing', valor: `${visibles} / ${this.maxVisibles()}`, detalle: libres ? `Quedan ${libres} espacios` : 'Límite alcanzado', icono: 'visibility', tono: 'bg-exito-bg text-exito-fg' },
      { titulo: 'Ocultos', valor: `${ocultos}`, detalle: 'No se muestran al público', icono: 'visibility_off', tono: 'bg-neutro-bg text-neutro-fg' },
      { titulo: 'Agotados', valor: `${agotados}`, detalle: agotados ? 'Revisa reposición' : 'Todo con stock', icono: 'production_quantity_limits', tono: 'bg-peligro-bg text-peligro-fg' },
    ];
  });

  protected readonly porCategoria = computed(() => {
    const conteo = new Map<string, number>();
    for (const p of this.productos()) {
      const n = p.categorias?.nombre ?? 'Sin categoría';
      conteo.set(n, (conteo.get(n) ?? 0) + 1);
    }
    return this.aBarras([...conteo.entries()]);
  });

  protected readonly porEstado = computed(() => {
    const lista = this.productos();
    return this.aBarras([
      ['Visible', lista.filter((p) => p.visible && !p.agotado).length],
      ['Oculto', lista.filter((p) => !p.visible && !p.agotado).length],
      ['Agotado', lista.filter((p) => p.agotado).length],
    ]);
  });

  protected readonly recientes = computed(() =>
    [...this.productos()].sort((a, b) => b.actualizado_en.localeCompare(a.actualizado_en)).slice(0, 5),
  );

  constructor() {
    void this.cargar();
  }

  protected precio(p: Producto): string {
    return formatearPrecio(p.precio, p.moneda);
  }

  private aBarras(pares: [string, number][]): Barra[] {
    const maximo = Math.max(1, ...pares.map(([, n]) => n));
    return pares.map(([nombre, cantidad]) => ({ nombre, cantidad, ancho: (cantidad / maximo) * 100 }));
  }

  private async cargar(): Promise<void> {
    try {
      const [productos, config] = await Promise.all([this.productosApi.listar(), this.configApi.obtener()]);
      this.productos.set(productos);
      this.maxVisibles.set(config.max_visibles);
    } catch {
      this.error.set('No pudimos cargar los datos. Revisa tu conexión y recarga la página.');
    } finally {
      this.cargando.set(false);
    }
  }
}
