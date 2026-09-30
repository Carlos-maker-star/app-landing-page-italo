import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';
import { urlHttps } from '../core/enlaces';
import { RedesSociales } from '../shared/redes-sociales';

@Component({
  selector: 'app-footer',
  imports: [RedesSociales],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-line">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm md:grid-cols-3">
        <div>
          <div class="display text-lg tracking-[.35em]">ISEVEN</div>
          <p class="mt-3 text-mute">Importaciones originales</p>
        </div>
        <div>
          <div class="mb-3 font-semibold">Contacto</div>
          <ul class="space-y-1 text-mute">
            @if (cfg().whatsapp) {
              <li>WhatsApp: {{ cfg().whatsapp }}</li>
            }
            @if (cfg().correo) {
              <li>{{ cfg().correo }}</li>
            }
            @if (cfg().direccion) {
              <li>
                @if (mapa()) {
                  <a [href]="mapa()" target="_blank" rel="noopener" class="hover:text-white">{{
                    cfg().direccion
                  }}</a>
                } @else {
                  {{ cfg().direccion }}
                }
              </li>
            }
            @if (cfg().horario) {
              <li>{{ cfg().horario }}</li>
            }
          </ul>
        </div>
        @if (hayRedes()) {
          <div>
            <div class="mb-3 font-semibold">Síguenos</div>
            <app-redes-sociales />
          </div>
        }
      </div>
      <div class="pb-8 text-center text-xs text-mute">© {{ anio }} ISEVEN</div>
    </footer>
  `,
})
export class Footer {
  protected readonly cfg = inject(CatalogoService).config;
  protected readonly mapa = computed(() => urlHttps(this.cfg().mapa_url));
  protected readonly hayRedes = computed(() => {
    const c = this.cfg();
    return [c.instagram, c.tiktok, c.facebook, c.correo].some((v) => v.trim());
  });
  protected readonly anio = new Date().getFullYear();
}
