import React from 'react';

const Header = ({
  title,
  currentChapterIndex,
  kapitelNummer,
  kapitelTitel,
  totalChapters,
}) => {
  const fallbackNummer = currentChapterIndex + 1;
  const numerisktNummer = Number.parseInt(kapitelNummer, 10);
  const harGiltigtNummer = !Number.isNaN(numerisktNummer) && numerisktNummer > 0;
  const visatNummer = harGiltigtNummer ? numerisktNummer : fallbackNummer;
  const visatNummerText = String(visatNummer).padStart(2, '0');

  return (
    <header className="sidhuvud">
      <h1>{title}</h1>
      <p className="kapitel-rad">
        Kapitel {visatNummerText} av {totalChapters}
        {kapitelTitel ? ` · ${kapitelTitel}` : ''}
      </p>
    </header>
  );
};

export default Header;
