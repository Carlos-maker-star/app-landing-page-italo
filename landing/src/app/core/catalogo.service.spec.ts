import { TestBed } from '@angular/core/testing';
import { CatalogoService } from './catalogo.service';
import { SUPABASE } from './supabase.client';

type Respuesta = { data: unknown; error: unknown };

/** Simula el cliente de Supabase: cada tabla devuelve lo que se haya cargado en `tablas`. */
export function clienteFalso(tablas: Record<string, Respuesta>) {
  const cadena = (respuesta: Respuesta): unknown =>
    new Proxy(
      {},
      {
        get: (_o, prop) => {
          if (prop === 'then') return (ok: (r: Respuesta) => unknown) => Promise.resolve(respuesta).then(ok);
          return () => cadena(respuesta);
        },
      },
    );
  return { from: (tabla: string) => cadena(tablas[tabla] ?? { data: null, error: null }) };
}

const producto = (id: string, nombre: string, categoria: string) => ({
  id, nombre, descripcion: null, precio: 10, moneda: 'USD', etiqueta: null, imagen_url: null, agotado: false, orden: 1,
  categorias: { nombre: categoria },
});

describe('CatalogoService · categorías', () => {
  const tablas: Record<string, Respuesta> = {};

  function crear() {
    TestBed.configureTestingModule({ providers: [{ provide: SUPABASE, useValue: clienteFalso(tablas) }] });
    return TestBed.inject(CatalogoService);
  }

  beforeEach(() => {
    tablas['configuracion'] = { data: { id: 1, max_visibles: 12 }, error: null };
    tablas['productos'] = { data: [producto('1', 'Nike Air Max', 'Zapatillas')], error: null };
    tablas['categorias'] = {
      data: [
        { id: 1, nombre: 'Zapatillas', orden: 1 },
        { id: 6, nombre: 'Chompa', orden: 2 },
      ],
      error: null,
    };
  });

  it('muestra una categoría nueva aunque todavía no tenga productos', async () => {
    const servicio = crear();
    await servicio.cargar();
    expect(servicio.categorias().map((c) => c.nombre)).toEqual(['Zapatillas', 'Chompa']);
    expect(servicio.conteo().get('Zapatillas')).toBe(1);
    expect(servicio.conteo().get('Chompa')).toBeUndefined();
    expect(servicio.cargando()).toBe(false);
  });

  it('refleja categorías agregadas, renombradas y eliminadas al refrescar', async () => {
    const servicio = crear();
    await servicio.cargar();

    tablas['categorias'] = {
      data: [
        { id: 1, nombre: 'Calzado', orden: 1 }, // renombrada
        { id: 7, nombre: 'Gorras', orden: 3 }, // nueva
      ], // "Chompa" eliminada
      error: null,
    };
    await servicio.refrescar(true);
    expect(servicio.categorias().map((c) => c.nombre)).toEqual(['Calzado', 'Gorras']);
  });

  it('quita el filtro si la categoría elegida fue eliminada', async () => {
    const servicio = crear();
    await servicio.cargar();
    servicio.categoriaActiva.set('Chompa');

    tablas['categorias'] = { data: [{ id: 1, nombre: 'Zapatillas', orden: 1 }], error: null };
    await servicio.refrescar(true);
    expect(servicio.categoriaActiva()).toBeNull();
  });

  it('no vuelve a pedir datos si acaba de cargar (máx. una vez por minuto)', async () => {
    const servicio = crear();
    await servicio.cargar();
    tablas['categorias'] = { data: [{ id: 9, nombre: 'Nueva', orden: 1 }], error: null };
    await servicio.refrescar(); // sin forzar
    expect(servicio.categorias().map((c) => c.nombre)).toEqual(['Zapatillas', 'Chompa']);
  });
});
