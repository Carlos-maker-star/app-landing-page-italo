import { Producto } from './models';

/** Solo para desarrollo, cuando Supabase aún no tiene productos. Nunca se usa en producción. */
export const PRODUCTOS_DEMO: Producto[] = [
  { id: 'd1', nombre: 'Nike Air Max 90', descripcion: null, precio: 189, moneda: 'USD', etiqueta: 'Nuevo', imagen_url: null, agotado: false, orden: 1, categoria: 'Zapatillas' },
  { id: 'd2', nombre: 'iPhone 15 Pro 256GB', descripcion: null, precio: 1199, moneda: 'USD', etiqueta: 'Por encargo', imagen_url: null, agotado: false, orden: 2, categoria: 'iPhones' },
  { id: 'd3', nombre: 'Hoodie Essentials', descripcion: null, precio: 79, moneda: 'USD', etiqueta: null, imagen_url: null, agotado: false, orden: 3, categoria: 'Ropa' },
  { id: 'd4', nombre: 'Jordan 1 Retro High', descripcion: null, precio: 249, moneda: 'USD', etiqueta: 'Últimas unidades', imagen_url: null, agotado: false, orden: 4, categoria: 'Zapatillas' },
  { id: 'd5', nombre: 'iPhone 14 128GB', descripcion: null, precio: 799, moneda: 'USD', etiqueta: null, imagen_url: null, agotado: false, orden: 5, categoria: 'iPhones' },
  { id: 'd6', nombre: 'Polo Ralph Lauren', descripcion: null, precio: 59, moneda: 'USD', etiqueta: 'Nuevo', imagen_url: null, agotado: false, orden: 6, categoria: 'Ropa' },
  { id: 'd7', nombre: 'Adidas Samba OG', descripcion: null, precio: 139, moneda: 'USD', etiqueta: null, imagen_url: null, agotado: false, orden: 7, categoria: 'Zapatillas' },
  { id: 'd8', nombre: 'AirPods Pro 2', descripcion: null, precio: 229, moneda: 'USD', etiqueta: 'Nuevo', imagen_url: null, agotado: false, orden: 8, categoria: 'iPhones' },
];
