import { buildWhatsAppUrl } from './whatsapp';

describe('buildWhatsAppUrl', () => {
  it('limpia el número y codifica el mensaje', () => {
    const url = buildWhatsAppUrl('+51 999-888-777', 'Hola, quiero {producto}', 'Nike Air Max');
    expect(url).toBe('https://wa.me/51999888777?text=Hola%2C%20quiero%20Nike%20Air%20Max');
  });

  it('usa un texto genérico cuando no hay producto', () => {
    const url = buildWhatsAppUrl('51999888777', 'Info de {producto}');
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Info de sus productos');
  });
});
