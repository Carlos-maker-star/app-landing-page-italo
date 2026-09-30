export interface ItemNav {
  etiqueta: string;
  /** Ícono de Material Symbols. */
  icono: string;
  ruta: string;
}

export interface SeccionNav {
  titulo: string;
  items: ItemNav[];
}

export const NAVEGACION: SeccionNav[] = [
  {
    titulo: 'General',
    items: [
      { etiqueta: 'Dashboard', icono: 'space_dashboard', ruta: '/dashboard' },
      { etiqueta: 'Productos', icono: 'inventory_2', ruta: '/productos' },
      { etiqueta: 'Categorías', icono: 'sell', ruta: '/categorias' },
    ],
  },
  {
    titulo: 'Sitio',
    items: [
      { etiqueta: 'Configuración', icono: 'tune', ruta: '/configuracion' },
      { etiqueta: 'Perfil', icono: 'account_circle', ruta: '/perfil' },
    ],
  },
];
