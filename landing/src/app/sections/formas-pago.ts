import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CatalogoService } from '../core/catalogo.service';
import { WhatsappService } from '../core/whatsapp.service';

@Component({
  selector: 'app-formas-pago',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="pagos" class="border-y border-line bg-surface">
      <div class="mx-auto max-w-6xl px-4 py-20">
        <span class="bars mb-3"><i></i><i></i><i></i></span>
        <h2 class="display text-2xl md:text-3xl">Formas de pago</h2>
        <p class="mt-4 max-w-xl text-mute">Pagas en dos partes: separas tu pedido y el resto lo pagas cuando lo recibes.</p>

        <div class="mt-10 grid gap-4 md:grid-cols-2">
          <article class="rounded-md border border-brand bg-ink p-8">
            <div class="display text-5xl text-brand">{{ adelanto() }}%</div>
            <h3 class="mt-4 text-lg font-semibold">Para separar tu pedido</h3>
            <p class="mt-2 text-sm text-mute">Con este adelanto confirmamos y compramos tu producto. Te enviamos el comprobante y el seguimiento.</p>
          </article>
          <article class="rounded-md border border-line bg-ink p-8">
            <div class="display text-5xl">{{ resto() }}%</div>
            <h3 class="mt-4 text-lg font-semibold">Al recibirlo</h3>
            <p class="mt-2 text-sm text-mute">Revisas tu producto y pagas el saldo en la entrega. Sin sorpresas.</p>
          </article>
        </div>

        @if (catalogo.config().metodos_pago.length) {
          <div class="mt-8">
            <div class="text-xs uppercase tracking-widest text-mute">Medios de pago aceptados</div>
            <ul class="mt-3 flex flex-wrap gap-2">
              @for (m of catalogo.config().metodos_pago; track m) {
                <li class="rounded-sm border border-line px-4 py-2 text-sm">{{ m }}</li>
              }
            </ul>
          </div>
        }

        <a [href]="wa.url()" target="_blank" rel="noopener" class="btn btn-primary mt-10">Consultar por WhatsApp</a>
      </div>
    </section>
  `,
})
export class FormasPago {
  protected readonly catalogo = inject(CatalogoService);
  protected readonly wa = inject(WhatsappService);
  protected readonly adelanto = computed(() => this.catalogo.config().adelanto_pct);
  protected readonly resto = computed(() => 100 - this.catalogo.config().adelanto_pct);
}
