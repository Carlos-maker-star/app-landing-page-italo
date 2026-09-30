import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PRODUCTOS_DEMO } from './datos-demo';
import { CONFIG_POR_DEFECTO, Categoria, Configuracion, Producto } from './models';
import { SUPABASE } from './supabase.client';

type Fila = Omit<Producto, 'categoria'> & { categorias: { nombre: string } | null };

/** Tiempo mínimo entre recargas automáticas cuando el visitante vuelve a la pestaña. */
const REFRESCO_MS = 60_000;

/** Carga configuración, categorías y productos visibles desde Supabase (solo en el navegador). */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly db = inject(SUPABASE);

  readonly config = signal<Configuracion>(CONFIG_POR_DEFECTO);
  readonly productos = signal<Producto[]>([]);
  /** Categorías tal como las administra el dueño (tabla `categorias`), ya ordenadas. */
  readonly categorias = signal<Categoria[]>([]);
  /** Categoría elegida en el filtro del catálogo (por nombre) o null para mostrar todo. */
  readonly categoriaActiva = signal<string | null>(null);
  readonly cargando = signal(true);

  /** Cuántos productos visibles tiene cada categoría. */
  readonly conteo = computed(() => {
    const mapa = new Map<string, number>();
    for (const p of this.productos()) if (p.categoria) mapa.set(p.categoria, (mapa.get(p.categoria) ?? 0) + 1);
    return mapa;
  });

  private iniciado = false;
  private ultimaCarga = 0;

  /** Primera carga (muestra el estado "cargando"). */
  async cargar(): Promise<void> {
    if (this.iniciado) return;
    this.iniciado = true;
    await this.traer();
    this.cargando.set(false);
  }

  /** Vuelve a leer todo sin mostrar "cargando"; se ignora si la última carga fue hace menos de un minuto. */
  async refrescar(forzar = false): Promise<void> {
    if (!this.iniciado || (!forzar && Date.now() - this.ultimaCarga < REFRESCO_MS)) return;
    await this.traer();
  }

  private async traer(): Promise<void> {
    this.ultimaCarga = Date.now();
    try {
      const { data: cfg } = await this.db.from('configuracion').select('*').eq('id', 1).maybeSingle();
      if (cfg) this.config.set({ ...CONFIG_POR_DEFECTO, ...cfg });

      const [productos, categorias] = await Promise.all([
        this.db
          .from('productos')
          .select('id,nombre,descripcion,precio,moneda,etiqueta,imagen_url,agotado,orden,categorias(nombre)')
          .eq('visible', true)
          .order('orden', { ascending: true })
          .limit(this.config().max_visibles)
          .overrideTypes<Fila[], { merge: false }>(),
        this.db
          .from('categorias')
          .select('id,nombre,orden')
          .order('orden', { ascending: true })
          .order('nombre', { ascending: true })
          .overrideTypes<Categoria[], { merge: false }>(),
      ]);
      if (productos.error) throw productos.error;

      const lista = (productos.data ?? []).map(({ categorias: c, ...p }) => ({ ...p, categoria: c?.nombre ?? null }));
      const usarDemo = !lista.length && !environment.production;
      this.productos.set(usarDemo ? PRODUCTOS_DEMO : lista);

      // Si la tabla no se pudo leer, se deducen del catálogo para no dejar el bloque vacío.
      const desdeBase = categorias.error ? [] : (categorias.data ?? []);
      this.categorias.set(desdeBase.length ? desdeBase : this.deducirCategorias());

      // Si la categoría elegida ya no existe (la borraron), se quita el filtro.
      const activa = this.categoriaActiva();
      if (activa && !this.categorias().some((c) => c.nombre === activa)) this.categoriaActiva.set(null);
    } catch (e) {
      console.error('No se pudo cargar el catálogo', e);
      if (!this.productos().length) this.productos.set(environment.production ? [] : PRODUCTOS_DEMO);
      if (!this.categorias().length) this.categorias.set(this.deducirCategorias());
    }
  }

  private deducirCategorias(): Categoria[] {
    const nombres = [...new Set(this.productos().map((p) => p.categoria).filter((c): c is string => !!c))];
    return nombres.map((nombre, i) => ({ id: -(i + 1), nombre, orden: i }));
  }
}
