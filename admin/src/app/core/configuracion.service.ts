import { Injectable } from '@angular/core';
import { Configuracion } from './models';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  async obtener(): Promise<Configuracion> {
    const { data, error } = await supabase().from('configuracion').select('*').eq('id', 1).single<Configuracion>();
    if (error) throw error;
    return data;
  }

  async guardar(datos: Omit<Configuracion, 'id' | 'foto_creador'>): Promise<Configuracion> {
    const { data, error } = await supabase().from('configuracion').update(datos).eq('id', 1).select().single<Configuracion>();
    if (error) throw error;
    return data;
  }

  /** Actualiza solo algunos campos (p. ej. la foto del perfil) sin tocar el resto. */
  async actualizar(parcial: Partial<Omit<Configuracion, 'id'>>): Promise<void> {
    // .select() permite detectar cuando la base no modificó ninguna fila (RLS lo hace sin error)
    const { data, error } = await supabase().from('configuracion').update(parcial).eq('id', 1).select('id');
    if (error) throw error;
    if (!data?.length) throw new Error('No se guardó el cambio: tu sesión no tiene permiso. Cierra sesión y vuelve a entrar.');
  }
}
