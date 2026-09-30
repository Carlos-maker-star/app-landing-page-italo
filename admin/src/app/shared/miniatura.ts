import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

/** Foto del producto en tamaño pequeño; sin foto muestra un ícono. */
@Component({
  selector: 'app-miniatura',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-surface-2 text-subtle">
      @if (url()) {
        <img [src]="url()" [alt]="nombre()" loading="lazy" class="size-full object-cover" />
      } @else {
        <mat-icon class="icono-sm" aria-hidden="true">image</mat-icon>
      }
    </span>
  `,
})
export class Miniatura {
  readonly url = input<string | null>(null);
  readonly nombre = input('');
}
