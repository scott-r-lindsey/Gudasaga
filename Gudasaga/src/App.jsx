import React, { useState, useEffect } from 'react';
import Sidhuvud from './Sidhuvud';
import Innehall from './Innehall';
import Navigering from './Navigering';
import { book } from './book';
import { hamtaKapitelInnehall, saknarKapitelinnehall } from './kapitelregister';
import './App.css';

function normaliseraKapitelParam(kapitelParam) {
  if (!kapitelParam) {
    return null;
  }

  const matchning = kapitelParam.match(/\d+/);
  if (!matchning) {
    return null;
  }

  const tal = Number.parseInt(matchning[0], 10);
  if (Number.isNaN(tal) || tal < 0) {
    return null;
  }

  return String(tal).padStart(2, '0');
}

function hamtaKapitelIndexFranUrl() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const params = new URLSearchParams(window.location.search);
  const normaliserad = normaliseraKapitelParam(params.get('kapitel'));

  if (!normaliserad) {
    return 0;
  }

  const hittadIndex = book.chapters.findIndex((kapitel) => kapitel.filIndex === normaliserad);
  return hittadIndex >= 0 ? hittadIndex : 0;
}

function skrivHistorikForKapitel(index, { ersatt = false } = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const aktuelltKapitel = book.chapters[index] ?? book.chapters[0];
  const kapitelId = aktuelltKapitel?.filIndex ?? '00';
  const url = new URL(window.location.href);
  url.searchParams.set('kapitel', kapitelId);
  const nySokvag = `${url.pathname}${url.search}${url.hash}`;

  if (ersatt) {
    window.history.replaceState(null, '', nySokvag);
  } else {
    window.history.pushState(null, '', nySokvag);
  }
}

function App() {
  if (saknarKapitelinnehall) {
    const bakgrundStil = {
      backgroundImage: 'repeating-linear-gradient(135deg, #ff00ff, #ff00ff 40px, #0ff 40px, #0ff 80px)',
      color: '#000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '4rem 1rem',
      fontFamily: '"Comic Sans MS", "Marker Felt", cursive, system-ui',
    };

    const rutaStil = {
      backgroundColor: 'rgba(255, 255, 0, 0.9)',
      border: '12px double red',
      boxShadow: '12px 12px 0 #000',
      padding: '2.5rem 3rem',
      maxWidth: '38rem',
      transform: 'rotate(-2deg)',
    };

    return (
      <div className="tomma-kapitel-varning" style={bakgrundStil}>
        <marquee behavior="alternate" direction="right" scrollAmount="18" style={{ fontSize: '2.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
          ❌ INGA KAPITEL HÄR ❌
        </marquee>
        <div style={rutaStil}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>PANIK! KAPITELSAKNADE.</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Vi hittade inga HTML-kapitel i <code>src/kapitel</code>. Utan dem är denna saga lika tom som Ginnungagap.
          </p>
          <ol style={{ textAlign: 'left', fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 'bold' }}>
            <li>Kör <code>bash verktyg/dela_upp_kapitel.sh</code> i projektroten.</li>
            <li>Starta om byggprocessen med <code>npm run dev</code> eller <code>npm run build</code>.</li>
            <li>Uppdatera sidan och ta ett djupt andetag.</li>
          </ol>
          <p style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>
            (Tips: kontrollera att filerna <code>src/kapitel/kapitel_00.html</code> osv. verkligen existerar.)
          </p>
        </div>
      </div>
    );
  }
  const [currentPage, setCurrentPage] = useState(() => hamtaKapitelIndexFranUrl());
  const [kapitelData, setKapitelData] = useState({
    kapitelNummer: null,
    titel: '',
    html: '',
    bildUrl: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let avbryt = false;
    const valtKapitel = book.chapters[currentPage];
    const kapitelSokvag = valtKapitel.sokvag;

    setLoading(true);
    setKapitelData({ kapitelNummer: null, titel: '', html: '', bildUrl: null });

    hamtaKapitelInnehall(kapitelSokvag)
      .then(data => {
        if (avbryt) {
          return;
        }

        setKapitelData({
          kapitelNummer: data.kapitelNummer ?? null,
          titel: data.titel ?? '',
          html: data.html ?? '',
          bildUrl: data.bildUrl ?? null,
        });
        setLoading(false);
      })
      .catch(fel => {
        if (avbryt) {
          return;
        }

        const arSaknatKapitel = fel instanceof Error && fel.message.includes('Saknar kapitel');
        const felMeddelande = arSaknatKapitel ? 'Kunde inte hitta kapitlet.' : 'Kunde inte läsa kapitlet.';
        setKapitelData({
          kapitelNummer: null,
          titel: 'Fel vid läsning',
          html: `<p>${felMeddelande}</p>`,
          bildUrl: null,
        });
        setLoading(false);
      });

    return () => {
      avbryt = true;
    };
  }, [currentPage]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const hanteraPopstate = () => {
      const indexFranUrl = hamtaKapitelIndexFranUrl();
      setCurrentPage(indexFranUrl);
    };

    window.addEventListener('popstate', hanteraPopstate);
    return () => window.removeEventListener('popstate', hanteraPopstate);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const urlKapitel = normaliseraKapitelParam(params.get('kapitel'));
    const aktuelltKapitelId = book.chapters[currentPage]?.filIndex ?? '00';

    if (urlKapitel !== aktuelltKapitelId) {
      skrivHistorikForKapitel(currentPage, { ersatt: true });
    }
  }, [currentPage]);

  const bytKapitel = (nyttIndex, { skrivHistorik = true } = {}) => {
    if (nyttIndex < 0 || nyttIndex >= book.chapters.length) {
      return;
    }

    setCurrentPage(nyttIndex);

    if (skrivHistorik) {
      skrivHistorikForKapitel(nyttIndex);
    }
  };

  const handleNext = () => {
    if (currentPage < book.chapters.length - 1) {
      bytKapitel(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      bytKapitel(currentPage - 1);
    }
  };

  const nuvarandeKapitel = book.chapters[currentPage];
  const fallbackKapitelNummer = kapitelData.kapitelNummer ?? nuvarandeKapitel.filIndex;

  return (
    <div className="ebook-reader">
      <Sidhuvud
        title={book.title}
        currentChapterIndex={currentPage}
        kapitelNummer={fallbackKapitelNummer}
        kapitelTitel={kapitelData.titel}
        totalChapters={book.chapters.length}
      />
      <Navigering
        placering="topp"
        onPrev={handlePrev}
        onNext={handleNext}
        disablePrev={currentPage === 0}
        disableNext={currentPage === book.chapters.length - 1}
      />
      <Innehall
        kapitelNummer={fallbackKapitelNummer}
        kapitelTitel={kapitelData.titel}
        html={kapitelData.html}
        bildUrl={kapitelData.bildUrl}
        loading={loading}
      />
      <Navigering
        placering="botten"
        onPrev={handlePrev}
        onNext={handleNext}
        disablePrev={currentPage === 0}
        disableNext={currentPage === book.chapters.length - 1}
      />
    </div>
  );
}

export default App;

// Låt Balder resa sig igen (när bygget lyckas)
