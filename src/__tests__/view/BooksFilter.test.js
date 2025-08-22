import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BooksFilter from '../../view/BooksFilter';
import { BooksController } from '../../viewmodel/BooksController';

// Mock the BooksController
jest.mock('../../viewmodel/BooksController');

describe('BooksFilter', () => {
  let mockController;

  beforeEach(() => {
    mockController = {
      isShowingAllBooks: true,
      setShowAllBooks: jest.fn(),
    };
  });

  test('should render both filter tabs', () => {
    render(<BooksFilter controller={mockController} />);
    
    expect(screen.getByText('All books')).toBeInTheDocument();
    expect(screen.getByText('Private books')).toBeInTheDocument();
  });

  test('should show "All books" as active by default', () => {
    render(<BooksFilter controller={mockController} />);
    
    const allBooksTab = screen.getByText('All books');
    const privateBooksTab = screen.getByText('Private books');
    
    expect(allBooksTab).toHaveClass('active');
    expect(privateBooksTab).not.toHaveClass('active');
  });

  test('should show "Private books" as active when controller shows private books', () => {
    mockController.isShowingAllBooks = false;
    render(<BooksFilter controller={mockController} />);
    
    const allBooksTab = screen.getByText('All books');
    const privateBooksTab = screen.getByText('Private books');
    
    expect(allBooksTab).not.toHaveClass('active');
    expect(privateBooksTab).toHaveClass('active');
  });

  test('should call setShowAllBooks(true) when "All books" is clicked', () => {
    render(<BooksFilter controller={mockController} />);
    
    const allBooksTab = screen.getByText('All books');
    fireEvent.click(allBooksTab);
    
    expect(mockController.setShowAllBooks).toHaveBeenCalledWith(true);
  });

  test('should call setShowAllBooks(false) when "Private books" is clicked', () => {
    render(<BooksFilter controller={mockController} />);
    
    const privateBooksTab = screen.getByText('Private books');
    fireEvent.click(privateBooksTab);
    
    expect(mockController.setShowAllBooks).toHaveBeenCalledWith(false);
  });
});
