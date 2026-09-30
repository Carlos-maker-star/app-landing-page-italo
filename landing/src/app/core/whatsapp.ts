/** Arma el enlace de WhatsApp con el mensaje ya escrito. */
export function buildWhatsAppUrl(numero: string, plantilla: string, producto?: string): string {
  const texto = plantilla.replace('{producto}', producto ?? 'sus productos');
  const digitos = numero.replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(texto)}`;
}
