import React, { useState, useEffect } from 'react';
import Header from './Header';
import Content from './Content';
import Navigation from './Navigation';
import { book } from './book';
import { hamtaKapitelInnehall } from './kapitelregister';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [kapitelData, setKapitelData] = useState({
    kapitelNummer: null,
    titel: '',
    html: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let avbryt = false;
    const valtKapitel = book.chapters[currentPage];
    const kapitelSokvag = valtKapitel.sokvag;

    setLoading(true);
    setKapitelData({ kapitelNummer: null, titel: '', html: '' });

    hamtaKapitelInnehall(kapitelSokvag)
      .then(data => {
        if (avbryt) {
          return;
        }

        setKapitelData(data);
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
        });
        setLoading(false);
      });

    return () => {
      avbryt = true;
    };
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < book.chapters.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nuvarandeKapitel = book.chapters[currentPage];
  const fallbackKapitelNummer = kapitelData.kapitelNummer ?? nuvarandeKapitel.filIndex;

  return (
    <div className="ebook-reader">
      <Header
        title={book.title}
        currentChapterIndex={currentPage}
        kapitelNummer={fallbackKapitelNummer}
        kapitelTitel={kapitelData.titel}
        totalChapters={book.chapters.length}
      />
      <Content
        kapitelNummer={fallbackKapitelNummer}
        kapitelTitel={kapitelData.titel}
        html={kapitelData.html}
        loading={loading}
      />
      <Navigation
        onPrev={handlePrev}
        onNext={handleNext}
        disablePrev={currentPage === 0}
        disableNext={currentPage === book.chapters.length - 1}
      />
    </div>
  );
}

export default App;
