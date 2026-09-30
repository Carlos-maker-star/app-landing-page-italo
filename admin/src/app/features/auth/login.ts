import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { mensajeDeError } from '../../core/supabase.client';
import { CampoContrasena } from '../../shared/campo-contrasena';
import { AuthLayout } from './auth-layout';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInput, MatButton, MatProgressBar, AuthLayout, CampoContrasena],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-layout>
      <form [formGroup]="form" (ngSubmit)="ingresar()" class="flex flex-col gap-6" novalidate>
        <div class="flex flex-col gap-2">
          <h1 class="display m-0 text-[22px]">Inicia sesión</h1>
          <p class="m-0 text-[15px] text-muted">Acceso solo para el administrador.</p>
        </div>

        @if (error()) {
          <p class="m-0 rounded-md bg-peligro-bg px-3 py-2 text-sm text-peligro-fg" role="alert">{{ error() }}</p>
        }

        <div class="flex flex-col gap-4">
          <mat-form-field>
            <mat-label>Correo</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" placeholder="admin@iseven.com" />
            @if (form.controls.email.hasError('required')) {
              <mat-error>El correo es obligatorio</mat-error>
            }
          </mat-form-field>
          <app-campo-contrasena [control]="form.controls.password" />
        </div>

        <div class="flex flex-col gap-2">
          <button matButton="filled" type="submit" class="h-11!" [disabled]="cargando()">Ingresar</button>
          @if (cargando()) {
            <mat-progress-bar mode="indeterminate" />
          }
        </div>
      </form>
    </app-auth-layout>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected async ingresar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.cargando.set(true);
    this.error.set(null);
    try {
      await this.auth.login(email, password);
      await this.router.navigate(['/dashboard']);
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.cargando.set(false);
    }
  }
}
