import { estadoProducto, formatearPrecio } from './etiquetas';
import { rutaEnBucket } from './imagenes.service';

describe('estadoProducto', () => {
  it('Agotado gana sobre Visible', () => {
    expect(estadoProducto({ visible: true, agotado: true }).etiqueta).toBe('Agotado');
  });
  it('distingue Visible y Oculto', () => {
    expect(estadoProducto({ visible: true, agotado: false }).etiqueta).toBe('Visible');
    expect(estadoProducto({ visible: false, agotado: false }).etiqueta).toBe('Oculto');
  });
});

describe('formatearPrecio', () => {
  it('incluye el símbolo de la moneda', () => {
    expect(formatearPrecio(189, 'USD')).toContain('189');
    expect(formatearPrecio(189, 'USD')).toContain('$');
  });
  it('no falla con una moneda desconocida', () => {
    expect(formatearPrecio(10, 'XX')).toContain('10');
  });
});

describe('rutaEnBucket', () => {
  it('extrae la ruta de una URL pública del bucket', () => {
    const url = 'https://x.supabase.co/storage/v1/object/public/productos/abc-123.webp';
    expect(rutaEnBucket(url)).toBe('abc-123.webp');
  });
  it('ignora URL de otros sitios', () => {
    expect(rutaEnBucket('https://example.com/foto.jpg')).toBeNull();
  });
});
