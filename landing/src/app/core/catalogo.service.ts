import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PRODUCTOS_DEMO } from './datos-demo';
import { CONFIG_POR_DEFECTO, Configuracion, Producto } from './models';
import { supabase } from './supabase.client';

type Fila = Omit<Producto, 'categoria'> & { categorias: { nombre: string } | null };

/** Carga configuración y productos visibles desde Supabase (solo en el navegador). */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  readonly config = signal<Configuracion>(CONFIG_POR_DEFECTO);
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly categorias = computed(() => [...new Set(this.productos().map((p) => p.categoria).filter((c): c is string => !!c))]);

  private iniciado = false;

  async cargar(): Promise<void> {
    if (this.iniciado) return;
    this.iniciado = true;
    try {
      const { data: cfg } = await supabase().from('configuracion').select('*').eq('id', 1).maybeSingle();
      if (cfg) this.config.set({ ...CONFIG_POR_DEFECTO, ...cfg });

      const { data, error } = await supabase()
        .from('productos')
        .select('id,nombre,descripcion,precio,moneda,etiqueta,imagen_url,agotado,orden,categorias(nombre)')
        .eq('visible', true)
        .order('orden', { ascending: true })
        .limit(this.config().max_visibles)
        .overrideTypes<Fila[], { merge: false }>();
      if (error) throw error;

      const lista = (data ?? []).map(({ categorias, ...p }) => ({ ...p, categoria: categorias?.nombre ?? null }));
      this.productos.set(lista.length || environment.production ? lista : PRODUCTOS_DEMO);
    } catch (e) {
      console.error('No se pudo cargar el catálogo', e);
      this.productos.set(environment.production ? [] : PRODUCTOS_DEMO);
    } finally {
      this.cargando.set(false);
    }
  }
}
