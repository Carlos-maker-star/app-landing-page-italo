/** Formatea el precio con el símbolo de su moneda: "$189", "S/ 300". */
export function formatearPrecio(precio: number, moneda: string): string {
  try {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: moneda, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(precio);
  } catch {
    return `${moneda} ${precio}`;
  }
}
