import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('./kapitelregister', () => ({
  hamtaKapitelInnehall: vi.fn(() =>
    Promise.resolve({
      kapitelNummer: '1',
      titel: 'Provkapitel',
      html: '<p>Testkapitelinnehåll</p>',
    })
  ),
}));

import App from './App';
import { hamtaKapitelInnehall } from './kapitelregister';

describe('App', () => {
  it('renders title, progress and chapter content', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /FÄDERNAS GUDASAGA - VIKTOR RYDBERG/i })).toBeInTheDocument();
    expect(screen.getByText(/Kapitel\s+01\s+av\s+42/i)).toBeInTheDocument();
    expect(screen.getByText('Laddar kapitel...')).toBeInTheDocument();

    const kapitelText = await screen.findByText('Testkapitelinnehåll');
    expect(kapitelText).toBeInTheDocument();
    expect(hamtaKapitelInnehall).toHaveBeenCalledWith('./kapitel/kapitel_00.html');

    await screen.findByText(/Kapitel\s+01\s+av\s+42\s+·\s+Provkapitel/i);
    await waitFor(() => {
      expect(screen.queryByText('Laddar kapitel...')).not.toBeInTheDocument();
    });
  });
});
