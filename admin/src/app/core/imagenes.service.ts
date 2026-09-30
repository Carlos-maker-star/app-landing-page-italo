import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { supabase } from './supabase.client';

const LADO_MAXIMO = 1200;
const CALIDAD_WEBP = 0.82;

/** Reduce la imagen a 1200 px de lado largo y la convierte a WebP (la landing carga más rápido). */
export async function optimizarImagen(archivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);
  lienzo.getContext('2d')!.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  bitmap.close();
  return new Promise((resolver, rechazar) =>
    lienzo.toBlob((blob) => (blob ? resolver(blob) : rechazar(new Error('No se pudo procesar la imagen.'))), 'image/webp', CALIDAD_WEBP),
  );
}

/** Ruta del archivo dentro del bucket a partir de su URL pública (o null si no es del bucket). */
export function rutaEnBucket(url: string): string | null {
  const marca = `/storage/v1/object/public/${environment.bucket}/`;
  const i = url.indexOf(marca);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marca.length));
}

@Injectable({ providedIn: 'root' })
export class ImagenesService {
  /** Optimiza y sube la foto al bucket público; devuelve su URL pública. */
  async subir(archivo: File): Promise<string> {
    if (!/^image\/(jpeg|png|webp|heic|heif|avif)$/.test(archivo.type)) throw new Error('Usa una foto JPG, PNG o WebP.');
    if (archivo.size > 20 * 1024 * 1024) throw new Error('La foto pesa más de 20 MB. Elige una más liviana.');
    const blob = await optimizarImagen(archivo);
    const ruta = `${crypto.randomUUID()}.webp`;
    const { error } = await supabase().storage.from(environment.bucket).upload(ruta, blob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
    });
    if (error) throw error;
    return supabase().storage.from(environment.bucket).getPublicUrl(ruta).data.publicUrl;
  }

  /** Borra fotos del bucket (ignora las URL que no son del bucket). No lanza si falla. */
  async borrar(urls: string[]): Promise<void> {
    const rutas = urls.map(rutaEnBucket).filter((r): r is string => !!r);
    if (rutas.length) await supabase().storage.from(environment.bucket).remove(rutas);
  }
}
