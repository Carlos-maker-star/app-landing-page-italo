import { formatearPrecio } from './precio';

describe('formatearPrecio', () => {
  it('usa el símbolo de la moneda', () => {
    expect(formatearPrecio(189, 'USD')).toContain('$');
    expect(formatearPrecio(300, 'PEN')).toContain('S/');
    expect(formatearPrecio(300, 'PEN')).not.toContain('PEN');
  });
  it('no falla con una moneda desconocida', () => {
    expect(formatearPrecio(10, 'XX')).toContain('10');
  });
});
