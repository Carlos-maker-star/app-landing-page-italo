import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WhatsappService } from '../core/whatsapp.service';

@Component({
  selector: 'app-cta-final',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grain bg-brand text-ink">
      <div class="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 class="display text-2xl leading-tight md:text-4xl">¿Buscas algo específico?<br />Lo traemos para ti</h2>
        <p class="mt-5">Escríbenos y te cotizamos en minutos.</p>
        <a [href]="wa.url()" target="_blank" rel="noopener" class="btn mt-8 bg-ink text-white hover:bg-black">Escribir por WhatsApp</a>
      </div>
    </section>
  `,
})
export class CtaFinal {
  protected readonly wa = inject(WhatsappService);
}
