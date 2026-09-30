import { buildWhatsAppUrl } from './whatsapp';

const texto = (url: string) => decodeURIComponent(url.split('text=')[1]);

describe('buildWhatsAppUrl', () => {
  it('limpia el número y codifica el mensaje', () => {
    const url = buildWhatsAppUrl('+51 999-888-777', 'Hola, quiero {producto}', 'Nike Air Max');
    expect(url).toBe('https://wa.me/51999888777?text=Hola%2C%20quiero%20Nike%20Air%20Max');
  });

  it('usa un texto genérico cuando no hay producto', () => {
    expect(texto(buildWhatsAppUrl('51999888777', 'Info de {producto}'))).toBe('Info de sus productos');
  });

  it('reemplaza el marcador aunque aparezca más de una vez', () => {
    expect(texto(buildWhatsAppUrl('519', '{producto}: ¿hay {producto}?', 'Chompa'))).toBe('Chompa: ¿hay Chompa?');
  });

  it('si la plantilla no trae {producto}, agrega el nombre al final para que no se pierda', () => {
    const t = texto(buildWhatsAppUrl('519', 'Hola ISEVEN, me interesa sus productos. ¿Está disponible?', 'Jordan 1 Retro'));
    expect(t).toBe('Hola ISEVEN, me interesa sus productos. ¿Está disponible? Producto: Jordan 1 Retro');
  });

  it('sin producto y sin marcador no agrega nada', () => {
    expect(texto(buildWhatsAppUrl('519', 'Hola, quiero información'))).toBe('Hola, quiero información');
  });
});
