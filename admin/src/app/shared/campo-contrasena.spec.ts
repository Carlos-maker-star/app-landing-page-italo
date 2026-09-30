import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { CampoContrasena } from './campo-contrasena';

describe('CampoContrasena', () => {
  function crear() {
    const fixture = TestBed.createComponent(CampoContrasena);
    fixture.componentRef.setInput('control', new FormControl('secreto1', { nonNullable: true, validators: Validators.required }));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, input: () => el.querySelector('input')!, boton: () => el.querySelector('button')! };
  }

  it('empieza oculta y el ojo la muestra y la vuelve a ocultar', () => {
    const { fixture, input, boton } = crear();
    expect(input().type).toBe('password');
    expect(boton().getAttribute('aria-label')).toBe('Mostrar contraseña');

    boton().click();
    fixture.detectChanges();
    expect(input().type).toBe('text');
    expect(boton().getAttribute('aria-label')).toBe('Ocultar contraseña');

    boton().click();
    fixture.detectChanges();
    expect(input().type).toBe('password');
  });

  it('el botón del ojo no envía el formulario', () => {
    expect(crear().boton().type).toBe('button');
  });
});
