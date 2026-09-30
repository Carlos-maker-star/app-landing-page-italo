import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ConfiguracionService } from '../../core/configuracion.service';
import { NotificacionService } from '../../core/notificacion.service';
import { mensajeDeError } from '../../core/supabase.client';

@Component({
  selector: 'app-configuracion',
  imports: [ReactiveFormsModule, MatButton, MatChipsModule, MatFormField, MatLabel, MatError, MatHint, MatInput, MatIcon, MatProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './configuracion.html',
})
export class ConfiguracionPage {
  private readonly api = inject(ConfiguracionService);
  private readonly notificar = inject(NotificacionService);

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly metodos = signal<string[]>([]);

  protected readonly form = inject(NonNullableFormBuilder).group({
    whatsapp: ['', [Validators.pattern(/^\+?[0-9\s-]{6,20}$/)]],
    correo: ['', Validators.email],
    direccion: [''],
    mapa_url: ['', Validators.pattern(/^(https:\/\/\S+)?$/i)],
    horario: [''],
    instagram: [''],
    tiktok: [''],
    facebook: [''],
    adelanto_pct: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    titular_hero: ['', Validators.required],
    ciudad: [''],
    anuncio: [''],
    mensaje_base: ['', Validators.required],
    max_visibles: [12, [Validators.required, Validators.min(1), Validators.max(48)]],
  });

  constructor() {
    void this.cargar();
  }

  protected agregarMetodo(evento: MatChipInputEvent): void {
    const valor = evento.value.trim();
    if (valor && !this.metodos().some((m) => m.toLowerCase() === valor.toLowerCase())) {
      this.metodos.update((m) => [...m, valor]);
    }
    evento.chipInput.clear();
  }

  protected quitarMetodo(metodo: string): void {
    this.metodos.update((m) => m.filter((x) => x !== metodo));
  }

  protected async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Revisa los campos marcados en rojo.');
      return;
    }
    const v = this.form.getRawValue();
    this.guardando.set(true);
    this.error.set(null);
    try {
      await this.api.guardar({
        ...v,
        whatsapp: v.whatsapp.trim(),
        correo: v.correo.trim(),
        mapa_url: v.mapa_url.trim(),
        instagram: v.instagram.trim(),
        tiktok: v.tiktok.trim(),
        facebook: v.facebook.trim(),
        metodos_pago: this.metodos(),
      });
      this.form.markAsPristine();
      this.notificar.exito('Configuración guardada. Ya se ve en la landing.');
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.guardando.set(false);
    }
  }

  private async cargar(): Promise<void> {
    try {
      const { id: _id, foto_creador: _foto, metodos_pago, ...resto } = await this.api.obtener();
      this.form.reset(resto);
      this.metodos.set(metodos_pago);
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.cargando.set(false);
    }
  }
}
