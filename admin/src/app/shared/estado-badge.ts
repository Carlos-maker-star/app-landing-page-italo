import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { estadoProducto } from '../core/etiquetas';
import { Producto } from '../core/models';

/** Etiqueta de estado del producto: Visible / Oculto / Agotado. */
@Component({
  selector: 'app-estado-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap" [class]="estado().clases">{{ estado().etiqueta }}</span>`,
})
export class EstadoBadge {
  readonly producto = input.required<Pick<Producto, 'visible' | 'agotado'>>();
  protected readonly estado = computed(() => estadoProducto(this.producto()));
}
