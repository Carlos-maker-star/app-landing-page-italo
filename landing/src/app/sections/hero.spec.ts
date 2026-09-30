import { TestBed } from '@angular/core/testing';
import { CatalogoService } from '../core/catalogo.service';
import { CONFIG_POR_DEFECTO } from '../core/models';
import { Hero } from './hero';

describe('Hero · foto del creador', () => {
  function crear(foto: string) {
    const fixture = TestBed.createComponent(Hero);
    TestBed.inject(CatalogoService).config.set({ ...CONFIG_POR_DEFECTO, foto_creador: foto });
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('muestra la foto del creador cuando está configurada', () => {
    const img = crear('https://x.supabase.co/storage/v1/object/public/productos/yo.webp').querySelector('img[alt="Foto del creador de ISEVEN"]');
    expect(img?.getAttribute('src')).toContain('yo.webp');
  });

  it('sin foto muestra el marcador "Foto del creador"', () => {
    const el = crear('');
    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent).toContain('creador');
  });
});
