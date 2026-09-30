export interface Categoria {
  id: number;
  nombre: string;
  orden: number;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  moneda: string;
  etiqueta: 'Nuevo' | 'Últimas unidades' | 'Por encargo' | null;
  imagen_url: string | null;
  agotado: boolean;
  orden: number;
  categoria: string | null;
}

export interface Configuracion {
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

export const CONFIG_POR_DEFECTO: Configuracion = {
  whatsapp: '',
  mensaje_base: 'Hola ISEVEN, me interesa {producto}. ¿Está disponible?',
  titular_hero: 'Lo mejor del mundo, en tu puerta',
  ciudad: '',
  horario: 'Lun–Sáb · 9:00–20:00',
  max_visibles: 12,
  instagram: '',
  tiktok: '',
  facebook: '',
  correo: '',
  direccion: '',
  mapa_url: '',
  anuncio: '',
  adelanto_pct: 50,
  metodos_pago: [],
  foto_creador: '',
};
