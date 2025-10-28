import React from 'react';

const Navigation = ({ onPrev, onNext, disablePrev, disableNext }) => {
  return (
    <nav className="navigering">
      <button onClick={onPrev} disabled={disablePrev}>Föregående</button>
      <button onClick={onNext} disabled={disableNext}>Nästa</button>
    </nav>
  );
};

export default Navigation;
