import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingState from '../../view/LoadingState';

describe('LoadingState', () => {
  test('should render default loading message', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should render custom loading message', () => {
    render(<LoadingState message="Please wait..." />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  test('should have correct CSS class', () => {
    const { container } = render(<LoadingState />);

    expect(container.querySelector('.loading')).toBeInTheDocument();
  });

  test('should be a pure component with no business logic', () => {
    const { container } = render(<LoadingState />);

    // Should only contain loading text and no business logic
    expect(container.innerHTML).toContain('Loading...');
    expect(container.innerHTML).not.toContain('function');
    expect(container.innerHTML).not.toContain('async');
  });
});
