import { TestBed } from '@angular/core/testing';
import { CatalogoService } from '../core/catalogo.service';
import { Categorias } from './categorias';

describe('Categorias (sección de la landing)', () => {
  function crear() {
    const fixture = TestBed.createComponent(Categorias);
    const servicio = TestBed.inject(CatalogoService);
    servicio.categorias.set([
      { id: 1, nombre: 'Zapatillas', orden: 1 },
      { id: 6, nombre: 'Chompa', orden: 2 },
    ]);
    servicio.productos.set([
      { id: 'a', nombre: 'Air Max', descripcion: null, precio: 1, moneda: 'USD', etiqueta: null, imagen_url: null, agotado: false, orden: 1, categoria: 'Zapatillas' },
    ]);
    fixture.detectChanges();
    return { el: fixture.nativeElement as HTMLElement, servicio };
  }

  it('dibuja una tarjeta por cada categoría de la base, incluida la nueva "Chompa"', () => {
    const { el } = crear();
    const titulos = Array.from(el.querySelectorAll('a .display')).map((t) => t.textContent!.trim());
    expect(titulos).toEqual(['Zapatillas', 'Chompa', 'A pedido']);
  });

  it('indica cuántos productos hay y "por encargo" cuando no hay ninguno', () => {
    const { el } = crear();
    const texto = el.textContent!;
    expect(texto).toContain('1 producto');
    expect(texto).toContain('Pídelo por encargo');
  });

  it('al pulsar una categoría activa el filtro del catálogo', () => {
    const { el, servicio } = crear();
    (el.querySelectorAll('a[href="#catalogo"]')[1] as HTMLElement).click();
    expect(servicio.categoriaActiva()).toBe('Chompa');
  });
});
