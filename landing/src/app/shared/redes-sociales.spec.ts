import { TestBed } from '@angular/core/testing';
import { CatalogoService } from '../core/catalogo.service';
import { CONFIG_POR_DEFECTO } from '../core/models';
import { RedesSociales } from './redes-sociales';

describe('RedesSociales', () => {
  function crear(parcial: Partial<typeof CONFIG_POR_DEFECTO>) {
    const fixture = TestBed.createComponent(RedesSociales);
    TestBed.inject(CatalogoService).config.set({ ...CONFIG_POR_DEFECTO, ...parcial });
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('no muestra nada si no hay redes configuradas', () => {
    expect(crear({}).querySelectorAll('a').length).toBe(0);
  });

  it('muestra un ícono con enlace por cada red llena', () => {
    const el = crear({ instagram: '@iseven.pe', tiktok: 'https://www.tiktok.com/@iseven', correo: 'hola@iseven.com' });
    const enlaces = Array.from(el.querySelectorAll('a'));
    expect(enlaces.map((a) => a.getAttribute('aria-label'))).toEqual(['Instagram', 'TikTok', 'Correo']);
    expect(enlaces[0].href).toBe('https://instagram.com/iseven.pe');
    expect(enlaces[2].href).toBe('mailto:hola@iseven.com');
    expect(enlaces.every((a) => a.querySelector('svg'))).toBe(true);
  });
});
