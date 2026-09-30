import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WhatsappService } from '../core/whatsapp.service';

@Component({
  selector: 'app-whatsapp-flotante',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [href]="wa.url()"
      target="_blank"
      rel="noopener"
      aria-label="Escribir por WhatsApp"
      class="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-wa shadow-lg transition hover:scale-105"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4.1-4.7-4.3-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" />
      </svg>
    </a>
  `,
})
export class WhatsappFlotante {
  protected readonly wa = inject(WhatsappService);
}
