const antalKapitel = 42;
const kapitelLista = [];

for (let kapitelIndex = 0; kapitelIndex < antalKapitel; kapitelIndex += 1) {
  const indexText = String(kapitelIndex).padStart(2, '0');
  kapitelLista.push(`./kapitel/kapitel_${indexText}.txt`);
}

export const book = {
  title: 'My Awesome Book',
  chapters: kapitelLista,
};
