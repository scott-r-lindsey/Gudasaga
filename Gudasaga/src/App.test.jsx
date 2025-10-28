import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the book title', () => {
    render(<App />);
    const headline = screen.getByText(/My Awesome Book/i);
    expect(headline).toBeInTheDocument();
  });
});
