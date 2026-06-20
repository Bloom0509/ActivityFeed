import { render, screen } from '@testing-library/react';
import App from './App';

test('renders activity feed heading', () => {
  render(<App />);

  const heading = screen.getByText(/activity feed/i);

  expect(heading).toBeInTheDocument();
});