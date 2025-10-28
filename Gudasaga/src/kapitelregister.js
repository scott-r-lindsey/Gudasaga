import { hamtaAnnoteringarForKapitel } from './annoteringsregister';

export const kapitelRegister = import.meta.glob('./kapitel/*.html', {
  query: '?raw',
  import: 'default',
});

export const saknarKapitelinnehall = Object.keys(kapitelRegister).length === 0;

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

  function normaliseraKapitelId(varde) {
    if (!varde) {
      return null;
    }

    const text = String(varde).trim();
    if (!/^\d+$/.test(text)) {
      return null;
    }

    return text.padStart(2, '0');
  }

  function skapaAnnoteringselement(doc, kapitelId, position, text, ordning) {
    const behallare = doc.createElement('span');
    behallare.className = 'annoteringssignal';
    behallare.setAttribute('data-annotering-index', String(position));

    const utlosare = doc.createElement('button');
    utlosare.type = 'button';
    utlosare.className = 'annoteringssignal__utlosare';
    utlosare.setAttribute('aria-label', 'Visa annotering');

    const panel = doc.createElement('span');
    panel.className = 'annoteringssignal__ruta';
    panel.setAttribute('role', 'tooltip');

    const panelId = `annotering-${kapitelId}-${String(position).padStart(3, '0')}-${ordning}`;
    panel.id = panelId;
    utlosare.setAttribute('aria-describedby', panelId);
    utlosare.textContent = 'ⓘ';
    panel.textContent = text;

    behallare.append(utlosare);
    behallare.append(panel);
    return behallare;
  }

  function infogaAnnoteringar(artikelElement, kapitelId) {
    if (!artikelElement || !kapitelId) {
      return;
    }

    const annoteringar = hamtaAnnoteringarForKapitel(kapitelId);
    if (!annoteringar || Object.keys(annoteringar).length === 0) {
      return;
    }

    const stycken = artikelElement.querySelectorAll('p');
    stycken.forEach((stycke, index) => {
      const position = index + 1;
      const texter = annoteringar[position];
      if (!texter) {
        return;
      }

      texter.forEach((text, ordning) => {
        const annotateNode = skapaAnnoteringselement(
          artikelElement.ownerDocument ?? document,
          kapitelId,
          position,
          text,
          ordning + 1,
        );
        stycke.insertAdjacentElement('afterend', annotateNode);
      });
    });
  }

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
  const normaliseratKapitelId = normaliseraKapitelId(kapitelNummer ?? filIndex) ?? filIndex;

  if (titelElement) {
    titelElement.remove();
  }

  infogaAnnoteringar(artikel, normaliseratKapitelId);

  return {
    kapitelNummer: kapitelNummer ?? filIndex,
    titel: kapitelTitel,
    html: artikel.innerHTML.trim(),
    bildUrl: hittaKapitelBild(normaliseratKapitelId),
  };
}

export function hamtaKapitelInnehall(sokvag) {
  const lasKapitel = kapitelRegister[sokvag];

  if (!lasKapitel) {
    return Promise.reject(new Error(`Saknar kapitel: ${sokvag}`));
  }

  return lasKapitel().then((html) => extraheraKapitel(html, sokvag));
}
