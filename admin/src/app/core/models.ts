export const ETIQUETAS = ['Nuevo', 'Últimas unidades', 'Por encargo'] as const;
export type Etiqueta = (typeof ETIQUETAS)[number];

export const MONEDAS = [
  { codigo: 'USD', nombre: 'USD ($)' },
  { codigo: 'PEN', nombre: 'PEN (S/)' },
  { codigo: 'EUR', nombre: 'EUR (€)' },
] as const;

export interface Categoria {
  id: number;
  nombre: string;
  orden: number;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: number | null;
  precio: number;
  moneda: string;
  etiqueta: Etiqueta | null;
  imagen_url: string | null;
  imagenes: string[];
  visible: boolean;
  agotado: boolean;
  orden: number;
  creado_en: string;
  actualizado_en: string;
  categorias: { nombre: string } | null;
}

/** Datos editables de un producto (lo que envía el formulario). */
export type ProductoForm = Pick<
  Producto,
  'nombre' | 'descripcion' | 'categoria_id' | 'precio' | 'moneda' | 'etiqueta' | 'imagen_url' | 'imagenes' | 'visible' | 'agotado' | 'orden'
>;

export interface Configuracion {
  id: number;
  whatsapp: string;
  mensaje_base: string;
  titular_hero: string;
  ciudad: string;
  horario: string;
  max_visibles: number;
  instagram: string;
  tiktok: string;
  facebook: string;
  correo: string;
  direccion: string;
  mapa_url: string;
  anuncio: string;
  adelanto_pct: number;
  metodos_pago: string[];
  foto_creador: string;
}
