import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { CategoriasService } from '../../core/categorias.service';
import { ConfiguracionService } from '../../core/configuracion.service';
import { formatearPrecio } from '../../core/etiquetas';
import { ImagenesService } from '../../core/imagenes.service';
import { Categoria, ETIQUETAS, Etiqueta, MONEDAS, ProductoForm } from '../../core/models';
import { NotificacionService } from '../../core/notificacion.service';
import { ProductosService } from '../../core/productos.service';
import { mensajeDeError } from '../../core/supabase.client';

const MAX_FOTOS = 4;

@Component({
  selector: 'app-producto-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    MatSelect,
    MatOption,
    MatSlideToggle,
    MatIcon,
    MatProgressBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './producto-form.html',
})
export class ProductoFormPage {
  /** :id de la ruta; ausente en /productos/nuevo. */
  readonly id = input<string>();

  private readonly api = inject(ProductosService);
  private readonly categoriasApi = inject(CategoriasService);
  private readonly configApi = inject(ConfiguracionService);
  private readonly imagenesApi = inject(ImagenesService);
  private readonly notificar = inject(NotificacionService);
  private readonly router = inject(Router);

  protected readonly maxFotos = MAX_FOTOS;
  protected readonly etiquetas = ETIQUETAS;
  protected readonly monedas = MONEDAS;

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly subiendo = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly noEncontrado = signal(false);

  /** URLs de las fotos; la primera es la principal. */
  protected readonly fotos = signal<string[]>([]);
  private originales: string[] = [];
  private subidasEnSesion = new Set<string>();

  private visiblesOtros = 0;
  private maxVisibles = 12;
  private eraVisible = false;

  protected readonly form = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    categoria_id: [null as number | null],
    precio: [null as number | null, [Validators.required, Validators.min(0)]],
    moneda: ['USD'],
    descripcion: ['', Validators.maxLength(300)],
    etiqueta: [null as Etiqueta | null],
    visible: [false],
    agotado: [false],
    orden: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly esNuevo = computed(() => !this.id());
  protected readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly vista = computed(() => {
    const v = this.valores();
    const cat = this.categorias().find((c) => c.id === v.categoria_id)?.nombre ?? '';
    const insignia = v.agotado ? 'Agotado' : v.etiqueta;
    return {
      nombre: v.nombre || 'Nombre del producto',
      categoria: cat,
      precio: v.precio != null ? formatearPrecio(v.precio, v.moneda ?? 'USD') : '$ 0',
      insignia,
      foto: this.fotos()[0] ?? null,
    };
  });


  constructor() {
    effect(() => {
      const id = this.id();
      void this.cargar(id);
    });
  }

  protected async elegirFotos(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []).slice(0, MAX_FOTOS - this.fotos().length);
    input.value = '';
    if (!archivos.length) return;
    this.subiendo.set(true);
    try {
      for (const archivo of archivos) {
        const url = await this.imagenesApi.subir(archivo);
        this.subidasEnSesion.add(url);
        this.fotos.update((f) => [...f, url]);
      }
    } catch (e) {
      this.notificar.error(mensajeDeError(e));
    } finally {
      this.subiendo.set(false);
    }
  }

  protected quitarFoto(i: number): void {
    const url = this.fotos()[i];
    this.fotos.update((f) => f.filter((_, k) => k !== i));
    if (this.subidasEnSesion.delete(url)) void this.imagenesApi.borrar([url]).catch(() => undefined);
  }

  protected hacerPrincipal(i: number): void {
    this.fotos.update((f) => [f[i], ...f.filter((_, k) => k !== i)]);
  }

  protected async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (v.visible && !this.eraVisible && this.visiblesOtros >= this.maxVisibles) {
      this.error.set(`Ya hay ${this.maxVisibles} productos visibles en la landing. Oculta uno o sube el máximo en Configuración.`);
      return;
    }
    const fotos = this.fotos();
    const datos: ProductoForm = {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim() || null,
      categoria_id: v.categoria_id,
      precio: Number(v.precio),
      moneda: v.moneda,
      etiqueta: v.etiqueta,
      imagen_url: fotos[0] ?? null,
      imagenes: fotos.slice(1),
      visible: v.visible,
      agotado: v.agotado,
      orden: v.orden,
    };
    this.guardando.set(true);
    this.error.set(null);
    try {
      const id = this.id();
      if (id) await this.api.actualizar(id, datos);
      else await this.api.crear(datos);
      // Fotos que ya no se usan: se borran del almacenamiento (si falla, no importa).
      void this.imagenesApi.borrar(this.originales.filter((u) => !fotos.includes(u))).catch(() => undefined);
      this.subidasEnSesion.clear();
      this.notificar.exito(id ? 'Producto actualizado.' : 'Producto creado.');
      await this.router.navigate(['/productos']);
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.guardando.set(false);
    }
  }

  protected async cancelar(): Promise<void> {
    // Las fotos subidas y no guardadas quedarían huérfanas: se limpian.
    if (this.subidasEnSesion.size) void this.imagenesApi.borrar([...this.subidasEnSesion]).catch(() => undefined);
    await this.router.navigate(['/productos']);
  }

  private async cargar(id: string | undefined): Promise<void> {
    this.cargando.set(true);
    try {
      const [categorias, config, todos] = await Promise.all([this.categoriasApi.listar(), this.configApi.obtener(), this.api.listar()]);
      this.categorias.set(categorias);
      this.maxVisibles = config.max_visibles;
      this.visiblesOtros = todos.filter((p) => p.visible && p.id !== id).length;
      if (id) {
        const p = todos.find((x) => x.id === id) ?? (await this.api.obtener(id));
        if (!p) {
          this.noEncontrado.set(true);
          return;
        }
        this.eraVisible = p.visible;
        this.originales = [...(p.imagen_url ? [p.imagen_url] : []), ...p.imagenes];
        this.fotos.set([...this.originales]);
        this.form.reset({
          nombre: p.nombre,
          categoria_id: p.categoria_id,
          precio: p.precio,
          moneda: p.moneda,
          descripcion: p.descripcion ?? '',
          etiqueta: p.etiqueta,
          visible: p.visible,
          agotado: p.agotado,
          orden: p.orden,
        });
      } else {
        this.form.patchValue({ orden: todos.length + 1 });
      }
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.cargando.set(false);
    }
  }
}
