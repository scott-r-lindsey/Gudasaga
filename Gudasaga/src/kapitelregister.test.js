import { describe, it, expect } from 'vitest';
import { hamtaKapitelInnehall } from './kapitelregister';

describe('kapitelregister', () => {
  it('infogar annoteringssignal efter stycke med matchande annotering', async () => {
    const data = await hamtaKapitelInnehall('./kapitel/kapitel_00.html');

    expect(data.html).toContain('annoteringssignal__utlosare');
    expect(data.html).toContain('Visa annotering');

    const parser = new DOMParser();
    const dom = parser.parseFromString(`<div>${data.html}</div>`, 'text/html');

    const stycke = dom.querySelector('p');
    expect(stycke).not.toBeNull();

    const utlosare = dom.querySelector('.annoteringssignal__utlosare');
    const ruta = dom.querySelector('.annoteringssignal__ruta');

    expect(utlosare).not.toBeNull();
    expect(ruta).not.toBeNull();
    expect(utlosare?.getAttribute('aria-describedby')).toMatch(/^annotering-00-001-/);
    expect(ruta?.textContent).toContain('Första styckets randanmärkning');
  });
});
