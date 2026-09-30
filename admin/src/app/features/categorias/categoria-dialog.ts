import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CategoriasService } from '../../core/categorias.service';
import { Categoria } from '../../core/models';
import { NotificacionService } from '../../core/notificacion.service';
import { mensajeDeError } from '../../core/supabase.client';

/** Crear o editar una categoría. Recibe la categoría al editar; se cierra con `true` si guardó. */
@Component({
  selector: 'app-categoria-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButton, MatFormField, MatLabel, MatError, MatInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ categoria ? 'Editar categoría' : 'Nueva categoría' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
      <mat-dialog-content class="flex! flex-col gap-4 pt-2!">
        @if (error()) {
          <p class="m-0 rounded-md bg-peligro-bg px-3 py-2 text-sm text-peligro-fg" role="alert">{{ error() }}</p>
        }
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" maxlength="40" placeholder="Zapatillas" />
          @if (form.controls.nombre.hasError('required')) { <mat-error>El nombre es obligatorio</mat-error> }
        </mat-form-field>
        <mat-form-field>
          <mat-label>Orden</mat-label>
          <input matInput type="number" min="0" formControlName="orden" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button matButton type="button" mat-dialog-close>Cancelar</button>
        <button matButton="filled" type="submit" [disabled]="guardando()">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class CategoriaDialog {
  protected readonly categoria = inject<Categoria | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<CategoriaDialog, boolean>);
  private readonly api = inject(CategoriasService);
  private readonly notificar = inject(NotificacionService);

  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    nombre: [this.categoria?.nombre ?? '', [Validators.required, Validators.maxLength(40)]],
    orden: [this.categoria?.orden ?? 0, Validators.min(0)],
  });

  protected async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, orden } = this.form.getRawValue();
    this.guardando.set(true);
    this.error.set(null);
    try {
      if (this.categoria) await this.api.actualizar(this.categoria.id, nombre, orden);
      else await this.api.crear(nombre, orden);
      this.notificar.exito(this.categoria ? 'Categoría actualizada.' : 'Categoría creada.');
      this.ref.close(true);
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.guardando.set(false);
    }
  }
}
