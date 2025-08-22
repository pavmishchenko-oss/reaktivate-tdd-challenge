import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../../view/EmptyState';

describe('EmptyState', () => {
  test('should render with default props', () => {
    render(<EmptyState />);

    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(
      screen.getByText('Start by adding your first item')
    ).toBeInTheDocument();
  });

  test('should render with custom props', () => {
    render(
      <EmptyState
        icon="🚗"
        title="No cars found"
        subtitle="Add your first car to get started"
      />
    );

    expect(screen.getByText('🚗')).toBeInTheDocument();
    expect(screen.getByText('No cars found')).toBeInTheDocument();
    expect(
      screen.getByText('Add your first car to get started')
    ).toBeInTheDocument();
  });

  test('should have correct CSS classes', () => {
    const { container } = render(<EmptyState />);

    expect(container.querySelector('.empty-state')).toBeInTheDocument();
    expect(container.querySelector('.empty-state-icon')).toBeInTheDocument();
    expect(container.querySelector('.empty-state-title')).toBeInTheDocument();
    expect(
      container.querySelector('.empty-state-subtitle')
    ).toBeInTheDocument();
  });

  test('should be a pure component with no business logic', () => {
    const { container } = render(<EmptyState />);

    // Should only contain UI elements and no business logic
    expect(container.innerHTML).toContain('📚');
    expect(container.innerHTML).toContain('No items found');
    expect(container.innerHTML).not.toContain('function');
    expect(container.innerHTML).not.toContain('async');
  });
});
