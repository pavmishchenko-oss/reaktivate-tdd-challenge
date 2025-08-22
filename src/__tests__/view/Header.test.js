import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../view/Header';
import { BooksController } from '../../viewmodel/BooksController';

// Mock the BooksController
jest.mock('../../viewmodel/BooksController');

describe('Header', () => {
  let mockController;

  beforeEach(() => {
    mockController = {
      privateBooksCount: 5,
    };
  });

  test('should render header with title', () => {
    render(<Header controller={mockController} />);
    
    expect(screen.getByText('Books App')).toBeInTheDocument();
  });

  test('should display private books count', () => {
    render(<Header controller={mockController} />);
    
    expect(screen.getByText('Your books: 5')).toBeInTheDocument();
  });

  test('should update count when controller changes', () => {
    const { rerender } = render(<Header controller={mockController} />);
    
    expect(screen.getByText('Your books: 5')).toBeInTheDocument();
    
    // Create a new mock controller with different count
    const newMockController = { privateBooksCount: 10 };
    rerender(<Header controller={newMockController} />);
    
    // Check that the counter element contains the new count
    const counterElement = screen.getByText(/Your books:/);
    expect(counterElement).toHaveTextContent('10');
  });
});
