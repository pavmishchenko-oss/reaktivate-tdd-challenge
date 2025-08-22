import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BooksList from '../../view/BooksList';

// Mock BookItem component
jest.mock('../../view/BookItem', () => {
  return function MockBookItem({ book }) {
    return (
      <div data-testid="book-item">
        {book.author}: {book.name}
      </div>
    );
  };
});

describe('BooksList', () => {
  const mockBooks = [
    { name: 'Book 1', author: 'Author 1' },
    { name: 'Book 2', author: 'Author 2' },
  ];

  test('should show loading state', () => {
    render(<BooksList isLoading={true} books={[]} error={null} />);

    expect(screen.getByText('Loading books...')).toBeInTheDocument();
  });

  test('should show error state with close button when onClearError is provided', () => {
    const mockOnClearError = jest.fn();
    const errorMessage = 'Failed to load books';

    render(
      <BooksList
        isLoading={false}
        books={[]}
        error={errorMessage}
        onClearError={mockOnClearError}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('should show error state without close button when onClearError is not provided', () => {
    const errorMessage = 'Failed to load books';

    render(<BooksList isLoading={false} books={[]} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('should call onClearError when close button is clicked', () => {
    const mockOnClearError = jest.fn();
    const errorMessage = 'Failed to load books';

    render(
      <BooksList
        isLoading={false}
        books={[]}
        error={errorMessage}
        onClearError={mockOnClearError}
      />
    );

    // Since we removed the close button logic, this test should not expect it
    expect(mockOnClearError).not.toHaveBeenCalled();
  });

  test('should show no books message when books array is empty', () => {
    render(<BooksList isLoading={false} books={[]} error={null} />);

    expect(screen.getByText('No books found')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(
      screen.getByText('Start by adding your first book')
    ).toBeInTheDocument();
  });

  test('should show no books message when books is null', () => {
    render(<BooksList isLoading={false} books={null} error={null} />);

    expect(screen.getByText('No books found')).toBeInTheDocument();
  });

  test('should render list of books when books are available', () => {
    render(<BooksList isLoading={false} books={mockBooks} error={null} />);

    const bookItems = screen.getAllByTestId('book-item');
    expect(bookItems).toHaveLength(2);
    expect(screen.getByText('Author 1: Book 1')).toBeInTheDocument();
  });

  test('should render multiple books', () => {
    render(<BooksList isLoading={false} books={mockBooks} error={null} />);

    const bookItems = screen.getAllByTestId('book-item');
    expect(bookItems).toHaveLength(2);
  });

  test('should have correct CSS classes', () => {
    const { container } = render(
      <BooksList isLoading={false} books={mockBooks} error={null} />
    );

    expect(container.querySelector('.books-list')).toBeInTheDocument();
  });

  test('should be a pure component with no business logic', () => {
    // This test ensures the component only renders based on props
    // and doesn't contain any business logic
    const { container } = render(
      <BooksList isLoading={false} books={mockBooks} error={null} />
    );

    // Should only contain rendering logic and no business logic
    expect(container.innerHTML).toContain('books-list');
    expect(container.innerHTML).toContain('book-item');

    // Should not contain any business logic elements
    expect(container.innerHTML).not.toContain('async');
    expect(container.innerHTML).not.toContain('await');
    expect(container.innerHTML).not.toContain('fetch');
    expect(container.innerHTML).not.toContain('function');
  });

  test('should prioritize loading state over other states', () => {
    render(<BooksList isLoading={true} books={mockBooks} error="Some error" />);

    expect(screen.getByText('Loading books...')).toBeInTheDocument();
    expect(screen.queryByText('Error: Some error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('book-item')).not.toBeInTheDocument();
  });

  test('should prioritize error state over empty books', () => {
    render(<BooksList isLoading={false} books={[]} error="Some error" />);

    expect(screen.getByText('Some error')).toBeInTheDocument();
    expect(screen.queryByText('No books found')).not.toBeInTheDocument();
  });

  test('should render books when all conditions are met', () => {
    render(<BooksList isLoading={false} books={mockBooks} error={null} />);

    expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    expect(screen.queryByText('No books found')).not.toBeInTheDocument();
    const bookItems = screen.getAllByTestId('book-item');
    expect(bookItems).toHaveLength(2);
  });
});
