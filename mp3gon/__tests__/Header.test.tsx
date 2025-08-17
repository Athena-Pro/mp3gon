import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header component', () => {
  it('renders the title', () => {
    render(<Header />);
    expect(screen.getByText('Sonic Geometer')).toBeInTheDocument();
  });
});
