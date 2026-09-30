import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { urlHttps } from '../core/enlaces';
import { CatalogoService } from '../core/catalogo.service';
import { WhatsappService } from '../core/whatsapp.service';
import { IconoProducto } from '../shared/icono-producto';

@Component({
  selector: 'app-hero',
  imports: [IconoProducto],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden">
      <div
        class="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/20 blur-[120px]"
      ></div>
      <div
        class="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24"
      >
        <div>
          <div class="mb-6 flex items-center gap-3">
            <span class="bars"><i></i><i></i><i></i></span>
            <span class="text-xs uppercase tracking-[.25em] text-mute">
              Importaciones{{ catalogo.config().ciudad ? ' en ' + catalogo.config().ciudad : '' }}
            </span>
          </div>
          <h1 class="display text-3xl leading-[1.15] md:text-5xl">
            {{ catalogo.config().titular_hero }}
          </h1>
          <p class="mt-6 max-w-md text-lg text-mute">
            Zapatillas, ropa y productos de Apple. Productos 100% originales, importados para ti y
            con entrega en tu ciudad.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#catalogo" class="btn btn-primary">Ver catálogo</a>
            <a [href]="wa.url()" target="_blank" rel="noopener" class="btn btn-ghost"
              >Cotizar por WhatsApp</a
            >
          </div>
          <dl class="mt-10 flex flex-wrap gap-x-6 gap-y-4 text-sm sm:gap-x-8">
            <div class="flex flex-col-reverse">
              <dt class="text-mute">Originales</dt>
              <dd class="display whitespace-nowrap text-base text-brand sm:text-xl">100%</dd>
            </div>
            <div class="flex flex-col-reverse">
              <dt class="text-mute">Entrega local</dt>
              <dd class="display whitespace-nowrap text-base text-brand sm:text-xl">24–48h</dd>
            </div>
            <div class="flex flex-col-reverse">
              <dt class="text-mute">Pedidos</dt>
              <dd class="display whitespace-nowrap text-base text-brand sm:text-xl">+20</dd>
            </div>
          </dl>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            class="grain flex aspect-[4/5] items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-brand to-[#c23500]"
            aria-hidden="true"
          >
            <app-icono-producto categoria="iphone" [tamano]="120" color="#fff" [trazo]="1.2" />
          </div>
          <div
            class="mt-10 flex aspect-[4/5] items-center justify-center rounded-md border border-line bg-surface"
            aria-hidden="true"
          >
            <app-icono-producto
              categoria="zapatilla"
              [tamano]="120"
              color="#FF4A00"
              [trazo]="1.2"
            />
          </div>
          <div
            class="-mt-10 flex aspect-[4/5] items-center justify-center rounded-md border border-line bg-surface"
            aria-hidden="true"
          >
            <app-icono-producto categoria="ropa" [tamano]="120" color="#FF4A00" [trazo]="1.2" />
          </div>
          @if (foto(); as foto) {
            <img
              [src]="foto"
              alt="Foto del creador de ISEVEN"
              width="400"
              height="500"
              class="aspect-[4/5] w-full rounded-md border border-line object-cover"
            />
          } @else {
            <div
              class="flex aspect-[4/5] items-center justify-center rounded-md border border-line bg-gradient-to-br from-[#26262b] to-[#111] p-4 text-center text-xs uppercase tracking-widest text-mute"
              aria-hidden="true"
            >
              Foto del<br />creador
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly catalogo = inject(CatalogoService);
  protected readonly wa = inject(WhatsappService);
  protected readonly foto = computed(() => urlHttps(this.catalogo.config().foto_creador));
}
