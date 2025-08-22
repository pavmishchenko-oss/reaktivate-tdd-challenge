import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorState from '../../view/ErrorState';

describe('ErrorState', () => {
  test('should render error message', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorState message={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('should have correct CSS classes', () => {
    const { container } = render(<ErrorState message="Error message" />);

    expect(container.querySelector('.error')).toBeInTheDocument();
    expect(container.querySelector('.error-message')).toBeInTheDocument();
  });

  test('should accept custom className', () => {
    const { container } = render(
      <ErrorState message="Error message" className="custom-error" />
    );

    expect(container.querySelector('.custom-error')).toBeInTheDocument();
  });

  test('should be a pure component with no business logic', () => {
    const { container } = render(<ErrorState message="Error message" />);

    // Should only contain error message and no business logic
    expect(container.innerHTML).toContain('Error message');
    expect(container.innerHTML).not.toContain('function');
    expect(container.innerHTML).not.toContain('async');
  });
});
