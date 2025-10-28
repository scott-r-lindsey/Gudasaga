export const kapitelRegister = import.meta.glob('./kapitel/*.html', {
  query: '?raw',
  import: 'default',
});

function extraheraKapitel(html, sokvag) {
  const filMatch = /kapitel_(\d+)\.html$/i.exec(sokvag);
  const filIndex = filMatch ? filMatch[1] : null;

  if (typeof DOMParser === 'undefined') {
    return {
      kapitelNummer: filIndex,
      titel: 'Okänt kapitel',
      html,
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const artikel = doc.querySelector('article');

  if (!artikel) {
    return {
      kapitelNummer: null,
      titel: doc.querySelector('h1')?.textContent?.trim() ?? 'Okänt kapitel',
      html,
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
  };
}

export function hamtaKapitelInnehall(sokvag) {
  const lasKapitel = kapitelRegister[sokvag];

  if (!lasKapitel) {
    return Promise.reject(new Error(`Saknar kapitel: ${sokvag}`));
  }

  return lasKapitel().then((html) => extraheraKapitel(html, sokvag));
}
