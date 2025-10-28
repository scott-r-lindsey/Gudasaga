const antalKapitel = 42;
const kapitelLista = [];

for (let kapitelIndex = 0; kapitelIndex < antalKapitel; kapitelIndex += 1) {
  const indexText = String(kapitelIndex).padStart(2, '0');
  kapitelLista.push({
    filIndex: indexText,
    sokvag: `./kapitel/kapitel_${indexText}.html`,
  });
}

export const book = {
  title: 'Fädernas Gudasaga - Viktor Rydberg',
  chapters: kapitelLista,
};
