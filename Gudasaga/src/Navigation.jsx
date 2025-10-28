import React from 'react';

const Navigation = ({
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  placering = 'botten',
}) => {
  const klassnamn = placering === 'topp'
    ? 'navigering navigering--topp'
    : 'navigering navigering--botten';

  return (
    <nav className={klassnamn} aria-label="Kapitelkontroller">
      <button onClick={onPrev} disabled={disablePrev}>Föregående</button>
      <button onClick={onNext} disabled={disableNext}>Nästa</button>
    </nav>
  );
};

export default Navigation;
