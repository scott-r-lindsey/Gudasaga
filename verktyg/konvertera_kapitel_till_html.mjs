#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_IN_DIR = 'resurser/kapitel';
const DEFAULT_OUT_DIR = 'resurser/kapitel_html';

/**
 * Skriver ut kort hjälptext.
 */
function visaHjalp() {
  console.log(`Användning: node verktyg/konvertera_kapitel_till_html.mjs [IN-MAPP] [UT-MAPP]

- IN-MAPP (valfri) anger var txt-kapitel ligger. Standard: ${DEFAULT_IN_DIR}
- UT-MAPP (valfri) anger var html-filer ska hamna. Standard: ${DEFAULT_OUT_DIR}

Kör skriptet från repo-roten så matchar standardvägarna.`);
}

/**
 * Skapar en ren sträng utan överflödiga radbrytningar och mellanslag.
 * Samtidigt slås radbrytningar ihop till ett och samma stycke.
 */
function byggParagrafer(rader) {
  const paragrafer = [];
  let buffert = [];

  const spolaBuffert = () => {
    if (buffert.length === 0) return;
    const stycke = buffert.join(' ').replace(/\s+/g, ' ').trim();
    if (stycke.length > 0) {
      paragrafer.push(stycke);
    }
    buffert = [];
  };

  for (const rad of rader) {
    if (rad.trim() === '') {
      spolaBuffert();
    } else {
      buffert.push(rad.trim());
    }
  }

  spolaBuffert();
  return paragrafer;
}

/**
 * HTML-escaping för att undvika trasiga dokument.
 */
function escapaHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Plockar ut kapitelnummer, titel och stycken ur ett txt-kapitel.
 */
function analyseraKapitel(innehall, filnamn) {
  const normaliserad = innehall.replace(/\r\n?/g, '\n');
  const rader = normaliserad.split('\n');
  let index = 0;

  const hamtaNastaRad = () => {
    while (index < rader.length) {
      const rad = rader[index++];
      if (rad.trim() !== '') {
        return rad.trim();
      }
    }
    return null;
  };

  const kapitelRad = hamtaNastaRad();
  if (!kapitelRad) {
    throw new Error(`Hittade inga rader i ${filnamn}`);
  }

  const kapitelMatch = kapitelRad.match(/^(\d+)\.?$/);
  let kapitelNummer = null;
  let titelRad = null;

  if (kapitelMatch) {
    kapitelNummer = kapitelMatch[1];
    titelRad = hamtaNastaRad();
    if (!titelRad) {
      throw new Error(`Saknar titelrad efter kapitelnumret i ${filnamn}`);
    }
  } else {
    console.warn(
      `⚠️  ${filnamn}: första raden "${kapitelRad}" liknar inget kapitelnummer. ` +
        'Skriptet fortsätter men markerar kapitlet som okänt.'
    );
    titelRad = kapitelRad;
  }

  const resterandeRader = rader.slice(index);
  const paragrafer = byggParagrafer(resterandeRader);

  return {
    kapitelNummer,
    titel: titelRad,
    paragrafer,
  };
}

/**
 * Renderar HTML-strukturen för ett kapitel.
 */
function genereraHtml({ kapitelNummer, titel, paragrafer }) {
  const kapitelAttribut =
    kapitelNummer !== null ? ` data-kapitel="${escapaHtml(kapitelNummer)}"` : '';
  const sidTitel =
    kapitelNummer !== null
      ? `${kapitelNummer}. ${titel}`
      : `Kapitel: ${titel}`;

  const paragrafHtml = paragrafer
    .map((stycke) => `    <p>${escapaHtml(stycke)}</p>`)
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <title>${escapaHtml(sidTitel)}</title>
</head>
<body>
  <article${kapitelAttribut}>
    <h1>${escapaHtml(titel)}</h1>
${paragrafHtml.length > 0 ? `\n${paragrafHtml}\n` : ''}
  </article>
</body>
</html>
`;
}

async function huvud() {
  const [argIn, argUt] = process.argv.slice(2);

  if (argIn === '--hjälp' || argIn === '-h') {
    visaHjalp();
    return;
  }

  const inMatning = path.resolve(process.cwd(), argIn ?? DEFAULT_IN_DIR);
  const utMatning = path.resolve(process.cwd(), argUt ?? DEFAULT_OUT_DIR);

  const filer = (await fs.readdir(inMatning)).filter((namn) => namn.endsWith('.txt'));
  if (filer.length === 0) {
    console.warn(`Inga txt-filer hittades i ${inMatning}`);
    return;
  }

  await fs.mkdir(utMatning, { recursive: true });

  for (const filnamn of filer) {
    const inFil = path.join(inMatning, filnamn);
    const utFil = path.join(
      utMatning,
      filnamn.replace(/\.txt$/i, '.html')
    );

    const innehall = await fs.readFile(inFil, 'utf8');
    const kapitel = analyseraKapitel(innehall, filnamn);
    const html = genereraHtml(kapitel);
    await fs.writeFile(utFil, html, 'utf8');

    console.log(`✓ Skapade ${path.relative(process.cwd(), utFil)}`);
  }
}

huvud().catch((fel) => {
  console.error('Misslyckades:', fel.message);
  process.exitCode = 1;
});

