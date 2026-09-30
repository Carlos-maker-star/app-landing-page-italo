/** Acepta "@usuario", "usuario" o una URL completa y devuelve siempre una URL válida (o '' si está vacío). */
function aUrl(valor: string, base: string): string {
  const v = valor.trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return base + v.replace(/^@/, '');
}

export const instagramUrl = (v: string) => aUrl(v, 'https://instagram.com/');
export const tiktokUrl = (v: string) => aUrl(v, 'https://www.tiktok.com/@');
export const facebookUrl = (v: string) => aUrl(v, 'https://facebook.com/');
export const mailtoUrl = (v: string) => (v.trim() ? `mailto:${v.trim()}` : '');

/** Solo deja pasar direcciones https (bloquea javascript:, data:, http:). Devuelve '' si no es segura. */
export function urlHttps(valor: string | null | undefined): string {
  const v = (valor ?? '').trim();
  return /^https:\/\//i.test(v) ? v : '';
}
