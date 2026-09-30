import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { CategoriasService } from '../../core/categorias.service';
import { Categoria } from '../../core/models';
import { NotificacionService } from '../../core/notificacion.service';
import { mensajeDeError } from '../../core/supabase.client';
import { ConfirmarDialog } from '../../shared/confirmar-dialog';
import { CategoriaDialog } from './categoria-dialog';

@Component({
  selector: 'app-categoria-list',
  imports: [MatButton, MatIconButton, MatIcon, MatProgressBar, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-1.5">
          <h1 class="display m-0 text-[22px]">Categorías</h1>
          <p class="m-0 text-sm text-muted">Sirven para filtrar el catálogo en la landing.</p>
        </div>
        <button matButton="filled" type="button" (click)="abrir()"><mat-icon>add</mat-icon>Nueva categoría</button>
      </div>

      @if (error()) {
        <p class="m-0 rounded-md bg-peligro-bg px-4 py-3 text-sm text-peligro-fg" role="alert">{{ error() }}</p>
      }

      <section class="overflow-hidden rounded-lg border border-line bg-surface">
        <div class="h-1">@if (cargando()) { <mat-progress-bar mode="indeterminate" /> }</div>
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-line bg-surface-2 text-xs font-semibold uppercase tracking-wide text-subtle">
              <th class="h-11 px-6 font-semibold">Nombre</th>
              <th class="w-28 px-4 font-semibold">Orden</th>
              <th class="w-28 px-6 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (c of categorias(); track c.id) {
              <tr class="h-14 border-b border-line last:border-b-0 hover:bg-surface-2">
                <td class="px-6 text-sm font-medium">{{ c.nombre }}</td>
                <td class="px-4 font-mono text-[13px] text-subtle">{{ c.orden }}</td>
                <td class="px-6 text-right whitespace-nowrap">
                  <button matIconButton type="button" (click)="abrir(c)" aria-label="Editar" matTooltip="Editar"><mat-icon class="icono-sm">edit</mat-icon></button>
                  <button matIconButton type="button" (click)="eliminar(c)" aria-label="Eliminar" matTooltip="Eliminar"><mat-icon class="icono-sm">delete</mat-icon></button>
                </td>
              </tr>
            } @empty {
              @if (!cargando()) {
                <tr>
                  <td colspan="3" class="px-6 py-12 text-center text-sm text-muted">Todavía no hay categorías. Crea la primera.</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </section>
    </div>
  `,
})
export class CategoriaList {
  private readonly api = inject(CategoriasService);
  private readonly dialog = inject(MatDialog);
  private readonly notificar = inject(NotificacionService);

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    void this.cargar();
  }

  protected abrir(categoria: Categoria | null = null): void {
    this.dialog
      .open(CategoriaDialog, { data: categoria })
      .afterClosed()
      .subscribe((guardado) => guardado && void this.cargar());
  }

  protected eliminar(c: Categoria): void {
    this.dialog
      .open(ConfirmarDialog, {
        data: {
          titulo: 'Eliminar categoría',
          mensaje: `Se eliminará “${c.nombre}”. Los productos de esta categoría quedarán sin categoría, pero no se borran.`,
          confirmar: 'Eliminar',
          peligro: true,
        },
      })
      .afterClosed()
      .subscribe(async (ok) => {
        if (!ok) return;
        try {
          await this.api.eliminar(c.id);
          this.notificar.exito('Categoría eliminada.');
          await this.cargar();
        } catch (e) {
          this.notificar.error(mensajeDeError(e));
        }
      });
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    try {
      this.categorias.set(await this.api.listar());
    } catch (e) {
      this.error.set(mensajeDeError(e));
    } finally {
      this.cargando.set(false);
    }
  }
}
