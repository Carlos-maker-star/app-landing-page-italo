import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MARCA } from '../../core/marca';
import { TemaService } from '../../core/tema.service';

/** Marco del login: panel de marca a la izquierda (≥ lg) y el formulario a la derecha. */
@Component({
  selector: 'app-auth-layout',
  imports: [MatIcon, MatIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-dvh bg-app text-ink">
      <section class="hidden w-[600px] shrink-0 flex-col justify-between bg-brand-panel px-16 py-14 text-[#0b0b0c] lg:flex">
        <span class="display text-[22px] tracking-[.4em]">{{ marca.nombre }}</span>
        <div class="flex flex-col gap-10">
          <h2 class="display m-0 text-[28px] leading-snug tracking-[.06em]">{{ marca.frase }}</h2>
          <ol class="m-0 flex list-none flex-col gap-5 p-0">
            @for (paso of marca.pasos; track $index) {
              <li class="flex items-start gap-4">
                <span class="display flex size-[34px] shrink-0 items-center justify-center border-2 border-[#0b0b0c] text-[13px] tracking-normal">
                  {{ $index + 1 }}
                </span>
                <span class="pt-1 text-base leading-normal">{{ paso }}</span>
              </li>
            }
          </ol>
        </div>
        <span class="text-[13px] opacity-80">{{ marca.ayuda }}</span>
      </section>

      <section class="relative flex flex-1 items-center justify-center px-4 py-12">
        <button
          matIconButton
          type="button"
          class="absolute! top-6 right-6"
          (click)="tema.alternar()"
          [attr.aria-label]="tema.oscuro() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <mat-icon>{{ tema.oscuro() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
        <div class="w-full max-w-[400px]">
          <span class="display mb-10 block text-lg tracking-[.35em] lg:hidden">{{ marca.nombre }}</span>
          <ng-content />
        </div>
      </section>
    </div>
  `,
})
export class AuthLayout {
  protected readonly tema = inject(TemaService);
  protected readonly marca = MARCA;
}
