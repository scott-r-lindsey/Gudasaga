export const kapitelRegister = import.meta.glob('./kapitel/*.html', {
  query: '?raw',
  import: 'default',
});

const kapitelBilder = import.meta.glob('./assets/kapitelbilder/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default',
});

function hittaKapitelBild(filIndex) {
  if (!filIndex) {
    return null;
  }

  const sokmönster = new RegExp(`kapitel_${filIndex}\\.[a-z0-9]+$`, 'i');
  const hittadPost = Object.entries(kapitelBilder).find(([sokvag]) => sokmönster.test(sokvag));

  return hittadPost ? hittadPost[1] : null;
}

function extraheraKapitel(html, sokvag) {
  const filMatch = /kapitel_(\d+)\.html$/i.exec(sokvag);
  const filIndex = filMatch ? filMatch[1] : null;

  if (typeof DOMParser === 'undefined') {
    return {
      kapitelNummer: filIndex,
      titel: 'Okänt kapitel',
      html,
      bildUrl: hittaKapitelBild(filIndex),
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const artikel = doc.querySelector('article');

  if (!artikel) {
    return {
      kapitelNummer: filIndex,
      titel: doc.querySelector('h1')?.textContent?.trim() ?? 'Okänt kapitel',
      html,
      bildUrl: hittaKapitelBild(filIndex),
    };
  }

  const titelElement = artikel.querySelector('h1');
  const kapitelNummer = artikel.getAttribute('data-kapitel');
  const kapitelTitel = titelElement?.textContent?.trim() ?? 'Okänt kapitel';

  if (titelElement) {
    titelElement.remove();
  }

  return {
    kapitelNummer: kapitelNummer ?? filIndex,
    titel: kapitelTitel,
    html: artikel.innerHTML.trim(),
    bildUrl: hittaKapitelBild(kapitelNummer ?? filIndex),
  };
}

export function hamtaKapitelInnehall(sokvag) {
  const lasKapitel = kapitelRegister[sokvag];

  if (!lasKapitel) {
    return Promise.reject(new Error(`Saknar kapitel: ${sokvag}`));
  }

  return lasKapitel().then((html) => extraheraKapitel(html, sokvag));
}
