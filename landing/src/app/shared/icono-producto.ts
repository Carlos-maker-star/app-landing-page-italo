import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Ícono lineal según la categoría; sirve de placeholder cuando el producto no tiene foto. */
@Component({
  selector: 'app-icono-producto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="tamano()"
      [attr.height]="tamano()"
      viewBox="0 0 24 24"
      fill="none"
      [attr.stroke]="color()"
      [attr.stroke-width]="trazo()"
      aria-hidden="true"
    >
      @switch (tipo()) {
        @case ('zapatilla') {
          <path d="M3 17v-4l4-1 2-5 3 2.5 5 1.5c2 .5 4 2 4 4v2z" />
          <path d="M3 17h18M9 7l1.5 3M12 9l1 2.5" />
        }
        @case ('telefono') {
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 19h2" />
        }
        @case ('ropa') {
          <path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3c-1 2-3 2-4 2s-3 0-4-2z" />
        }
        @default {
          <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
          <path d="M3 7l9 4 9-4M12 11v10" />
        }
      }
    </svg>
  `,
  host: { class: 'inline-flex' },
})
export class IconoProducto {
  readonly categoria = input<string | null>(null);
  readonly tamano = input(84);
  readonly color = input('#3a3a40');
  readonly trazo = input(1);

  protected readonly tipo = computed(() => {
    const c = (this.categoria() ?? '').toLowerCase();
    if (/zapat|calzado|sneaker/.test(c)) return 'zapatilla';
    if (/iphone|tech|tecnolog|celular|phone/.test(c)) return 'telefono';
    if (/ropa|polo|casaca|hoodie|prenda/.test(c)) return 'ropa';
    return 'caja';
  });
}
