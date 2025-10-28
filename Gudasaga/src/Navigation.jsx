import React from 'react';

const Navigation = ({ onPrev, onNext }) => {
  return (
    <nav>
      <button onClick={onPrev}>Previous</button>
      <button onClick={onNext}>Next</button>
    </nav>
  );
};

export default Navigation;
