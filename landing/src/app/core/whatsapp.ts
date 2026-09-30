/**
 * Arma el enlace de WhatsApp con el mensaje ya escrito.
 * La plantilla usa {producto}; si el administrador la escribió sin ese marcador, el nombre del producto
 * se agrega al final para que el vendedor siempre sepa qué quiere el cliente.
 */
export function buildWhatsAppUrl(numero: string, plantilla: string, producto?: string): string {
  const conMarcador = plantilla.includes('{producto}');
  let texto = plantilla.split('{producto}').join(producto ?? 'sus productos');
  if (producto && !conMarcador) texto = `${texto} Producto: ${producto}`;
  const digitos = numero.replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(texto)}`;
}
