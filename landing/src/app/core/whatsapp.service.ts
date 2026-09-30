import { Injectable, inject } from '@angular/core';
import { CatalogoService } from './catalogo.service';
import { buildWhatsAppUrl } from './whatsapp';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly catalogo = inject(CatalogoService);

  url(producto?: string): string {
    const { whatsapp, mensaje_base } = this.catalogo.config();
    return buildWhatsAppUrl(whatsapp, mensaje_base, producto);
  }
}
