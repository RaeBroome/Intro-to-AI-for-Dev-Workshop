import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock fetch for API calls
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('App', () => {
  it('renders the task manager heading', () => {
    render(<App />);
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
  });

  it('displays the subtitle', () => {
    render(<App />);
    expect(screen.getByText(/Agentic Workshop Starter/i)).toBeInTheDocument();
  });

  it('shows the create task form', () => {
    render(<App />);
    expect(screen.getByText(/Create New Task/i)).toBeInTheDocument();
  });
});
