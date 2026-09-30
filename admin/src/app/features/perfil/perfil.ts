import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { AbstractControl, FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AuthService } from '../../core/auth/auth.service';
import { ConfiguracionService } from '../../core/configuracion.service';
import { ImagenesService } from '../../core/imagenes.service';
import { NotificacionService } from '../../core/notificacion.service';
import { mensajeDeError } from '../../core/supabase.client';
import { CampoContrasena } from '../../shared/campo-contrasena';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, MatButton, MatIcon, MatProgressBar, CampoContrasena],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil.html',
})
export class PerfilPage {
  protected readonly auth = inject(AuthService);
  private readonly config = inject(ConfiguracionService);
  private readonly imagenes = inject(ImagenesService);
  private readonly notificar = inject(NotificacionService);

  // ── Foto del creador ────────────────────────────────────────────────
  protected readonly foto = signal('');
  protected readonly cargandoFoto = signal(true);
  protected readonly subiendoFoto = signal(false);
  protected readonly errorFoto = signal<string | null>(null);

  // ── Contraseña ──────────────────────────────────────────────────────
  private readonly directivaPassword = viewChild('dirPassword', { read: FormGroupDirective });
  protected readonly cambiandoPassword = signal(false);
  protected readonly errorPassword = signal<string | null>(null);

  protected readonly formPassword = inject(NonNullableFormBuilder).group(
    {
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(8)]],
      repetir: ['', Validators.required],
    },
    { validators: validarNuevaPassword },
  );

  constructor() {
    // Los errores del grupo se muestran bajo el campo que corresponde
    this.formPassword.valueChanges.subscribe(() => {
      const { nueva, repetir } = this.formPassword.controls;
      const g = this.formPassword.errors;
      repetir.setErrors(g?.['noCoinciden'] ? { mensaje: 'Las contraseñas no coinciden' } : repetir.hasError('required') ? { required: true } : null, { emitEvent: false });
      if (g?.['igualActual'] && nueva.value) {
        nueva.setErrors({ ...(nueva.errors ?? {}), mensaje: 'La nueva contraseña debe ser distinta de la actual' }, { emitEvent: false });
      }
    });
    void this.cargarFoto();
  }

  protected async elegirFoto(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo) return;
    this.subiendoFoto.set(true);
    this.errorFoto.set(null);
    const anterior = this.foto();
    let nueva = '';
    try {
      nueva = await this.imagenes.subir(archivo);
      await this.config.actualizar({ foto_creador: nueva });
      this.foto.set(nueva);
      if (anterior) void this.imagenes.borrar([anterior]).catch(() => undefined);
      this.notificar.exito('Foto actualizada. Ya se ve en la landing.');
    } catch (e) {
      // Si se subió pero no se pudo guardar, se limpia para no dejar archivos huérfanos
      if (nueva) void this.imagenes.borrar([nueva]).catch(() => undefined);
      this.errorFoto.set(mensajeDeError(e));
    } finally {
      this.subiendoFoto.set(false);
    }
  }

  protected async quitarFoto(): Promise<void> {
    const anterior = this.foto();
    if (!anterior) return;
    this.subiendoFoto.set(true);
    this.errorFoto.set(null);
    try {
      await this.config.actualizar({ foto_creador: '' });
      this.foto.set('');
      void this.imagenes.borrar([anterior]).catch(() => undefined);
      this.notificar.exito('Foto eliminada.');
    } catch (e) {
      this.errorFoto.set(mensajeDeError(e));
    } finally {
      this.subiendoFoto.set(false);
    }
  }

  protected async cambiarPassword(): Promise<void> {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }
    const { actual, nueva } = this.formPassword.getRawValue();
    this.cambiandoPassword.set(true);
    this.errorPassword.set(null);
    try {
      await this.auth.cambiarPassword(actual, nueva);
      // resetForm limpia también el estado "enviado"; con reset() los campos vacíos saldrían en rojo
      const directiva = this.directivaPassword();
      if (directiva) directiva.resetForm();
      else this.formPassword.reset();
      this.notificar.exito('Contraseña cambiada. Úsala la próxima vez que entres.');
    } catch (e) {
      this.errorPassword.set(mensajeDeError(e));
    } finally {
      this.cambiandoPassword.set(false);
    }
  }

  private async cargarFoto(): Promise<void> {
    try {
      this.foto.set((await this.config.obtener()).foto_creador ?? '');
    } catch (e) {
      this.errorFoto.set(mensajeDeError(e));
    } finally {
      this.cargandoFoto.set(false);
    }
  }
}

/** La nueva contraseña debe coincidir con su repetición y ser distinta de la actual. */
function validarNuevaPassword(g: AbstractControl): ValidationErrors | null {
  const { actual, nueva, repetir } = g.value as { actual: string; nueva: string; repetir: string };
  if (nueva && repetir && nueva !== repetir) return { noCoinciden: true };
  if (actual && nueva && actual === nueva) return { igualActual: true };
  return null;
}
