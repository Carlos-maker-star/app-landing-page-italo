import { Producto } from './models';

export type TonoEstado = 'exito' | 'neutro' | 'peligro' | 'curso' | 'nuevo';

export interface EstadoProducto {
  etiqueta: string;
  /** Clases completas (Tailwind no detecta clases concatenadas). */
  clases: string;
}

const CLASES: Record<TonoEstado, string> = {
  exito: 'bg-exito-bg text-exito-fg',
  neutro: 'bg-neutro-bg text-neutro-fg',
  peligro: 'bg-peligro-bg text-peligro-fg',
  curso: 'bg-curso-bg text-curso-fg',
  nuevo: 'bg-nuevo-bg text-nuevo-fg',
};

/** Estado que ve el administrador: Agotado > Visible > Oculto. */
export function estadoProducto(p: Pick<Producto, 'visible' | 'agotado'>): EstadoProducto {
  if (p.agotado) return { etiqueta: 'Agotado', clases: CLASES.peligro };
  if (p.visible) return { etiqueta: 'Visible', clases: CLASES.exito };
  return { etiqueta: 'Oculto', clases: CLASES.neutro };
}

export const CLASES_ETIQUETA = CLASES;

/** Formatea el precio con su moneda: "$189", "S/ 250". */
export function formatearPrecio(precio: number, moneda: string): string {
  try {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: moneda, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(precio);
  } catch {
    return `${moneda} ${precio}`;
  }
}
