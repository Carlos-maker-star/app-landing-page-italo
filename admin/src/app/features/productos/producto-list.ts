import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CategoriasService } from '../../core/categorias.service';
import { ConfiguracionService } from '../../core/configuracion.service';
import { formatearPrecio } from '../../core/etiquetas';
import { ImagenesService } from '../../core/imagenes.service';
import { Categoria, Producto } from '../../core/models';
import { NotificacionService } from '../../core/notificacion.service';
import { ProductosService } from '../../core/productos.service';
import { mensajeDeError } from '../../core/supabase.client';
import { ConfirmarDialog } from '../../shared/confirmar-dialog';
import { EstadoBadge } from '../../shared/estado-badge';
import { Miniatura } from '../../shared/miniatura';

type FiltroEstado = 'todos' | 'visible' | 'oculto' | 'agotado';

@Component({
  selector: 'app-producto-list',
  imports: [RouterLink, MatButton, MatIconButton, MatIcon, MatProgressBar, MatPaginator, MatSlideToggle, MatTooltip, EstadoBadge, Miniatura],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './producto-list.html',
})
export class ProductoList {
  private readonly api = inject(ProductosService);
  private readonly categoriasApi = inject(CategoriasService);
  private readonly configApi = inject(ConfiguracionService);
  private readonly imagenes = inject(ImagenesService);
  private readonly dialog = inject(MatDialog);
  private readonly notificar = inject(NotificacionService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly maxVisibles = signal(12);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly busqueda = signal('');
  protected readonly categoria = signal<number | null>(null);
  protected readonly estado = signal<FiltroEstado>('todos');
  protected readonly pagina = signal(0);
  protected readonly tamanio = signal(10);

  protected readonly estados: { valor: FiltroEstado; etiqueta: string }[] = [
    { valor: 'todos', etiqueta: 'Todos' },
    { valor: 'visible', etiqueta: 'Visibles' },
    { valor: 'oculto', etiqueta: 'Ocultos' },
    { valor: 'agotado', etiqueta: 'Agotados' },
  ];

  protected readonly visiblesCount = computed(() => this.productos().filter((p) => p.visible).length);

  protected readonly filtrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    const est = this.estado();
    return this.productos().filter(
      (p) =>
        (!q || p.nombre.toLowerCase().includes(q)) &&
        (cat === null || p.categoria_id === cat) &&
        (est === 'todos' || (est === 'visible' && p.visible) || (est === 'oculto' && !p.visible) || (est === 'agotado' && p.agotado)),
    );
  });

  protected readonly filas = computed(() => {
    const desde = this.pagina() * this.tamanio();
    return this.filtrados().slice(desde, desde + this.tamanio());
  });

  protected readonly filtroActivo = computed(() => !!this.busqueda() || this.categoria() !== null || this.estado() !== 'todos');

  constructor() {
    void this.cargar();
  }

  protected precio(p: Producto): string {
    return formatearPrecio(p.precio, p.moneda);
  }

  protected buscar(texto: string): void {
    this.busqueda.set(texto);
    this.pagina.set(0);
  }

  protected filtrarCategoria(valor: string): void {
    this.categoria.set(valor ? Number(valor) : null);
    this.pagina.set(0);
  }

  protected filtrarEstado(valor: FiltroEstado): void {
    this.estado.set(valor);
    this.pagina.set(0);
  }

  protected limpiar(): void {
    this.busqueda.set('');
    this.categoria.set(null);
    this.estado.set('todos');
    this.pagina.set(0);
  }

  protected cambiarPagina(e: PageEvent): void {
    this.pagina.set(e.pageIndex);
    this.tamanio.set(e.pageSize);
  }

  /** Muestra u oculta el producto en la landing, respetando el máximo configurado. */
  protected async alternarVisible(p: Producto, evento: MatSlideToggleChange): Promise<void> {
    const visible = evento.checked;
    if (visible && this.visiblesCount() >= this.maxVisibles()) {
      evento.source.checked = false;
      this.notificar.error(`Ya hay ${this.maxVisibles()} productos visibles. Oculta uno o sube el máximo en Configuración.`);
      return;
    }
    try {
      const guardado = await this.api.actualizar(p.id, { visible });
      this.productos.update((lista) => lista.map((x) => (x.id === p.id ? guardado : x)));
      this.notificar.exito(visible ? `“${p.nombre}” ahora se ve en la landing.` : `“${p.nombre}” se ocultó de la landing.`);
    } catch (e) {
      evento.source.checked = !visible;
      this.notificar.error(mensajeDeError(e));
    }
  }

  protected eliminar(p: Producto): void {
    this.dialog
      .open(ConfirmarDialog, {
        data: {
          titulo: 'Eliminar producto',
          mensaje: `Se eliminará “${p.nombre}” y sus fotos. Esta acción no se puede deshacer. Si solo quieres quitarlo de la landing, mejor ocúltalo.`,
          confirmar: 'Eliminar',
          peligro: true,
        },
      })
      .afterClosed()
      .subscribe(async (ok) => {
        if (!ok) return;
        try {
          await this.api.eliminar(p.id);
          void this.imagenes.borrar([...(p.imagen_url ? [p.imagen_url] : []), ...p.imagenes]).catch(() => undefined);
          this.productos.update((lista) => lista.filter((x) => x.id !== p.id));
          this.notificar.exito('Producto eliminado.');
        } catch (e) {
          this.notificar.error(mensajeDeError(e));
        }
      });
  }

  private async cargar(): Promise<void> {
    try {
      const [productos, categorias, config] = await Promise.all([this.api.listar(), this.categoriasApi.listar(), this.configApi.obtener()]);
      this.productos.set(productos);
      this.categorias.set(categorias);
      this.maxVisibles.set(config.max_visibles);
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.cargando.set(false);
    }
  }
}
