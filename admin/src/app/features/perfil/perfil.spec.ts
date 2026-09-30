import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ConfiguracionService } from '../../core/configuracion.service';
import { PerfilPage } from './perfil';

interface Pagina {
  formPassword: FormGroup;
  cambiarPassword: () => Promise<void>;
}

describe('Perfil', () => {
  const cambiarPassword = vi.fn().mockResolvedValue(undefined);

  function crear(fotoInicial = '') {
    cambiarPassword.mockClear();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { email: () => 'admin@iseven.com', cambiarPassword } },
        { provide: ConfiguracionService, useValue: { obtener: () => Promise.resolve({ foto_creador: fotoInicial }), actualizar: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(PerfilPage);
    fixture.detectChanges();
    return { fixture, pagina: fixture.componentInstance as unknown as Pagina, el: fixture.nativeElement as HTMLElement };
  }

  it('no llama al servicio si las contraseñas no coinciden', async () => {
    const { pagina } = crear();
    pagina.formPassword.setValue({ actual: 'vieja-123', nueva: 'nueva-1234', repetir: 'otra-12345' });
    await pagina.cambiarPassword();
    expect(pagina.formPassword.get('repetir')?.getError('mensaje')).toBe('Las contraseñas no coinciden');
    expect(cambiarPassword).not.toHaveBeenCalled();
  });

  it('exige mínimo 8 caracteres', async () => {
    const { pagina } = crear();
    pagina.formPassword.setValue({ actual: 'vieja-123', nueva: 'corta', repetir: 'corta' });
    await pagina.cambiarPassword();
    expect(pagina.formPassword.get('nueva')?.hasError('minlength')).toBe(true);
    expect(cambiarPassword).not.toHaveBeenCalled();
  });

  it('rechaza una nueva contraseña igual a la actual', async () => {
    const { pagina } = crear();
    pagina.formPassword.setValue({ actual: 'misma-clave-1', nueva: 'misma-clave-1', repetir: 'misma-clave-1' });
    await pagina.cambiarPassword();
    expect(cambiarPassword).not.toHaveBeenCalled();
  });

  it('cambia la contraseña y deja el formulario limpio, sin errores en rojo', async () => {
    const { fixture, pagina, el } = crear();
    pagina.formPassword.setValue({ actual: 'vieja-123', nueva: 'nueva-1234', repetir: 'nueva-1234' });
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(cambiarPassword).toHaveBeenCalledWith('vieja-123', 'nueva-1234');
    expect(pagina.formPassword.getRawValue()).toEqual({ actual: '', nueva: '', repetir: '' });
    expect(el.querySelectorAll('mat-error').length).toBe(0);
  });

  it('muestra la foto guardada', async () => {
    const { fixture, el } = crear('https://x.supabase.co/storage/v1/object/public/productos/yo.webp');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('img')?.getAttribute('src')).toContain('yo.webp');
  });
});
