import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth/auth.service';
import { MARCA } from '../core/marca';
import { TemaService } from '../core/tema.service';
import { NAVEGACION } from './navegacion';

/** Layout de las páginas privadas: menú lateral + barra superior + contenido. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIcon, MatIconButton, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
})
export class Shell {
  protected readonly auth = inject(AuthService);
  protected readonly tema = inject(TemaService);
  private readonly router = inject(Router);

  protected readonly marca = MARCA;
  protected readonly navegacion = NAVEGACION;
  protected readonly landingUrl = environment.landingUrl;
  protected readonly menuAbierto = signal(false);

  /** Título de la barra superior: `data: { titulo }` de la ruta activa. */
  protected readonly titulo = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      startWith(null),
      map(() => tituloDeRuta(this.router.routerState.snapshot.root)),
    ),
    { initialValue: '' },
  );
}

function tituloDeRuta(ruta: ActivatedRouteSnapshot): string {
  let actual = ruta;
  while (actual.firstChild) {
    actual = actual.firstChild;
  }
  return (actual.data['titulo'] as string | undefined) ?? '';
}
