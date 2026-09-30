import { facebookUrl, instagramUrl, mailtoUrl, tiktokUrl, urlHttps } from './enlaces';

describe('enlaces sociales', () => {
  it('convierte @usuario y usuario en URL', () => {
    expect(instagramUrl('@iseven.pe')).toBe('https://instagram.com/iseven.pe');
    expect(instagramUrl(' iseven.pe ')).toBe('https://instagram.com/iseven.pe');
    expect(tiktokUrl('@iseven')).toBe('https://www.tiktok.com/@iseven');
    expect(facebookUrl('iseven')).toBe('https://facebook.com/iseven');
  });

  it('respeta las URL completas', () => {
    expect(instagramUrl('https://instagram.com/otra')).toBe('https://instagram.com/otra');
  });

  it('devuelve vacío cuando no hay valor', () => {
    expect(instagramUrl('  ')).toBe('');
    expect(mailtoUrl('')).toBe('');
    expect(mailtoUrl('hola@iseven.com')).toBe('mailto:hola@iseven.com');
  });
});

describe('urlHttps', () => {
  it('acepta https y rechaza esquemas peligrosos', () => {
    expect(urlHttps('https://maps.google.com/?q=x')).toBe('https://maps.google.com/?q=x');
    expect(urlHttps('javascript:alert(1)')).toBe('');
    expect(urlHttps('data:text/html,<script>alert(1)</script>')).toBe('');
    expect(urlHttps('http://insegura.com')).toBe('');
    expect(urlHttps(null)).toBe('');
  });
  it('un usuario de Instagram con esquema raro no se convierte en javascript:', () => {
    expect(instagramUrl('javascript:alert(1)').startsWith('https://instagram.com/')).toBe(true);
  });
});
