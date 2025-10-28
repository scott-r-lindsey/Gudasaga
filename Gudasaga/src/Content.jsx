import React from 'react';

const Content = ({ kapitelNummer, kapitelTitel, html, loading }) => {
  if (loading) {
    return (
      <main aria-busy="true">
        <div className="laddningsruta" role="status">
          <div className="laddningsrondell" aria-hidden="true" />
          <span className="laddningstext">Laddar kapitel...</span>
        </div>
      </main>
    );
  }

  const kapitelSiffra = Number.parseInt(kapitelNummer, 10);
  const harGiltigtNummer = !Number.isNaN(kapitelSiffra) && kapitelSiffra > 0;
  const visatNummer = harGiltigtNummer ? String(kapitelSiffra).padStart(2, '0') : null;
  const visadTitel = kapitelTitel || 'Kapitel';

  return (
    <main aria-live="polite">
      <article className="kapitelinnehall">
        <header className="kapitel-inledning">
          {visatNummer ? <p className="kapitel-nummer">Kapitel {visatNummer}</p> : null}
          <h2>{visadTitel}</h2>
        </header>
        <div
          className="kapitel-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
};

export default Content;
