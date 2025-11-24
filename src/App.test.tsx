import { render, screen } from '@testing-library/react';
import App from './App';
import './i18n';

describe('App', () => {
  it('renders drop zone prompt when no pages', () => {
    render(<App />);
    expect(screen.getByText(/Zip Viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Drop a ZIP/i)).toBeInTheDocument();
  });
});
