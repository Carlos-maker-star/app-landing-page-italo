import { Injectable } from '@angular/core';
import { Categoria } from './models';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  async listar(): Promise<Categoria[]> {
    const { data, error } = await supabase()
      .from('categorias')
      .select('*')
      .order('orden', { ascending: true })
      .order('nombre', { ascending: true })
      .overrideTypes<Categoria[], { merge: false }>();
    if (error) throw error;
    return data ?? [];
  }

  async crear(nombre: string, orden: number): Promise<Categoria> {
    const { data, error } = await supabase().from('categorias').insert({ nombre: nombre.trim(), orden }).select().single<Categoria>();
    if (error) throw error;
    return data;
  }

  async actualizar(id: number, nombre: string, orden: number): Promise<void> {
    const { error } = await supabase().from('categorias').update({ nombre: nombre.trim(), orden }).eq('id', id);
    if (error) throw error;
  }

  /** Los productos de la categoría quedan "sin categoría" (on delete set null). */
  async eliminar(id: number): Promise<void> {
    const { error } = await supabase().from('categorias').delete().eq('id', id);
    if (error) throw error;
  }
}
