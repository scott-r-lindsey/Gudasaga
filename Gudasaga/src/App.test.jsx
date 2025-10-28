import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';

vi.mock('./kapitelregister', () => ({
  hamtaKapitelInnehall: vi.fn(() =>
    Promise.resolve({
      kapitelNummer: '1',
      titel: 'Provkapitel',
      html: '<p>Testkapitelinnehåll</p>',
      bildUrl: 'https://exempel.se/kapitel_01.jpg',
    })
  ),
}));

import App from './App';
import { hamtaKapitelInnehall } from './kapitelregister';

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState({}, '', '/');
});

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
    const bild = await screen.findByRole('img', { name: /illustration för provkapitel/i });
    expect(bild).toHaveAttribute('src', 'https://exempel.se/kapitel_01.jpg');
    await waitFor(() => {
      expect(screen.queryByText('Laddar kapitel...')).not.toBeInTheDocument();
    });
    expect(window.location.search).toContain('kapitel=00');
  });

  it('läser in valt kapitel från url-parametern', async () => {
    window.history.replaceState({}, '', '/?kapitel=03');

    render(<App />);

    await waitFor(() => {
      expect(hamtaKapitelInnehall).toHaveBeenCalledWith('./kapitel/kapitel_03.html');
    });
    expect(window.location.search).toContain('kapitel=03');
  });

  it('uppdaterar webbadressen när användaren navigerar', async () => {
    render(<App />);

    await screen.findByText('Testkapitelinnehåll');

    const nastaKnapp = screen.getByRole('button', { name: /Nästa/i });
    fireEvent.click(nastaKnapp);

    await waitFor(() => {
      expect(hamtaKapitelInnehall).toHaveBeenLastCalledWith('./kapitel/kapitel_01.html');
    });
    expect(window.location.search).toContain('kapitel=01');
  });

  it('återställer kapitel vid popstate-händelser', async () => {
    render(<App />);

    await screen.findByText('Testkapitelinnehåll');

    await act(async () => {
      window.history.pushState({}, '', '/?kapitel=02');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    await waitFor(() => {
      expect(hamtaKapitelInnehall).toHaveBeenLastCalledWith('./kapitel/kapitel_02.html');
    });
    expect(window.location.search).toContain('kapitel=02');
  });
});
