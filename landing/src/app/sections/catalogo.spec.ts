import { TestBed } from '@angular/core/testing';
import { CatalogoService } from '../core/catalogo.service';
import { Catalogo } from './catalogo';

describe('Catalogo · filtros por categoría', () => {
  function crear() {
    const fixture = TestBed.createComponent(Catalogo);
    const servicio = TestBed.inject(CatalogoService);
    servicio.cargando.set(false);
    servicio.categorias.set([
      { id: 1, nombre: 'Zapatillas', orden: 1 },
      { id: 6, nombre: 'Chompa', orden: 2 },
    ]);
    servicio.productos.set([
      { id: 'a', nombre: 'Air Max', descripcion: null, precio: 1, moneda: 'USD', etiqueta: null, imagen_url: null, agotado: false, orden: 1, categoria: 'Zapatillas' },
    ]);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement, servicio };
  }

  const botones = (el: HTMLElement) => Array.from(el.querySelectorAll('[role="group"] button')).map((b) => b.textContent!.trim());

  it('los botones del filtro salen de la tabla de categorías, no solo de los productos', () => {
    expect(botones(crear().el)).toEqual(['Todo', 'Zapatillas', 'Chompa']);
  });

  it('una categoría sin productos muestra un mensaje y un botón para pedirla por WhatsApp', () => {
    const { fixture, el, servicio } = crear();
    servicio.categoriaActiva.set('Chompa');
    fixture.detectChanges();
    expect(el.querySelectorAll('article').length).toBe(0);
    expect(el.textContent).toContain('no hay Chompa');
    expect(el.textContent).toContain('Pedir Chompa por WhatsApp');
  });

  it('el botón del producto es corto (icono + "Cotizar") y no se parte; el nombre completo va en aria-label', () => {
    const { el } = crear();
    const boton = el.querySelector('article a.btn')!;
    expect(boton.textContent!.trim()).toBe('Cotizar');
    expect(boton.classList.contains('whitespace-nowrap')).toBe(true);
    expect(boton.querySelector('svg')).not.toBeNull();
    expect(boton.getAttribute('aria-label')).toBe('Cotizar Air Max por WhatsApp');
  });

  it('con "Todo" vuelven todos los productos', () => {
    const { fixture, el, servicio } = crear();
    servicio.categoriaActiva.set('Chompa');
    fixture.detectChanges();
    (el.querySelector('[role="group"] button') as HTMLElement).click();
    fixture.detectChanges();
    expect(servicio.categoriaActiva()).toBeNull();
    expect(el.querySelectorAll('article').length).toBe(1);
  });
});
