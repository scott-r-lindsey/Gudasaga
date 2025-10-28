const annoteringsKarta = import.meta.glob('./annoteringar/*.txt', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function extraheraNyckel(sokvag) {
  const matchning = /annoteringar\/kapitel_(\d+)-(\d+)\.txt$/i.exec(sokvag);
  if (!matchning) {
    return null;
  }

  const [, kapitelId, indexText] = matchning;
  const position = Number.parseInt(indexText, 10);

  if (Number.isNaN(position) || position < 1) {
    return null;
  }

  return {
    kapitelId,
    position,
  };
}

const annoteringsIndex = Object.entries(annoteringsKarta).reduce((acc, [sokvag, innehall]) => {
  const nyckel = extraheraNyckel(sokvag);
  if (!nyckel) {
    return acc;
  }

  const renText = (innehall ?? '').trim();
  if (!renText) {
    return acc;
  }

  const { kapitelId, position } = nyckel;
  if (!acc[kapitelId]) {
    acc[kapitelId] = {};
  }

  if (!acc[kapitelId][position]) {
    acc[kapitelId][position] = [];
  }

  acc[kapitelId][position].push(renText);
  return acc;
}, {});

export function hamtaAnnoteringarForKapitel(kapitelId) {
  if (!kapitelId) {
    return {};
  }

  return annoteringsIndex[kapitelId] ?? {};
}

export function listaAnnoteradeKapitel() {
  return Object.keys(annoteringsIndex);
}
