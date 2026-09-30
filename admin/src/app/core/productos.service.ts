import { Injectable } from '@angular/core';
import { Producto, ProductoForm } from './models';
import { supabase } from './supabase.client';

const COLUMNAS = '*, categorias(nombre)';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  /** Todos los productos (el catálogo es pequeño: filtros y paginación se hacen en el cliente). */
  async listar(): Promise<Producto[]> {
    const { data, error } = await supabase()
      .from('productos')
      .select(COLUMNAS)
      .order('orden', { ascending: true })
      .order('creado_en', { ascending: false })
      .overrideTypes<Producto[], { merge: false }>();
    if (error) throw error;
    return data ?? [];
  }

  async obtener(id: string): Promise<Producto | null> {
    const { data, error } = await supabase()
      .from('productos')
      .select(COLUMNAS)
      .eq('id', id)
      .maybeSingle<Producto>();
    if (error) throw error;
    return data;
  }

  async crear(datos: ProductoForm): Promise<Producto> {
    const { data, error } = await supabase().from('productos').insert(datos).select(COLUMNAS).single<Producto>();
    if (error) throw error;
    return data;
  }

  async actualizar(id: string, datos: Partial<ProductoForm>): Promise<Producto> {
    const { data, error } = await supabase().from('productos').update(datos).eq('id', id).select(COLUMNAS).single<Producto>();
    if (error) throw error;
    return data;
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await supabase().from('productos').delete().eq('id', id);
    if (error) throw error;
  }
}
