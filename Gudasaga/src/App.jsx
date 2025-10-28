import React, { useState, useEffect } from 'react';
import Header from './Header';
import Content from './Content';
import Navigation from './Navigation';
import { book } from './book';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [chapterContent, setChapterContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    import(`${book.chapters[currentPage]}?raw`)
      .then(chapter => {
        setChapterContent(chapter.default);
        setLoading(false);
      });
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

  return (
    <div className="ebook-reader">
      <Header title={book.title} />
      <Content text={loading ? 'Loading...' : chapterContent} />
      <Navigation onPrev={handlePrev} onNext={handleNext} />
    </div>
  );
}

export default App;
