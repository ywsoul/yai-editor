import { render, screen } from '@testing-library/react';
import { YaiEditor } from '../index';

describe('YaiEditor', () => {
  it('renders without crashing', () => {
    render(<YaiEditor />);
    expect(screen.getByText('Enter some text...')).toBeInTheDocument();
  });

  it('renders with custom onChange handler', () => {
    const handleChange = vi.fn();
    render(<YaiEditor onChange={handleChange} />);
    expect(screen.getByText('Enter some text...')).toBeInTheDocument();
  });
}); 