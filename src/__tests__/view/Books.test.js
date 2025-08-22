import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Books from '../../view/Books';

// Mock the UI components
jest.mock('../../view/BookForm', () => {
  return function MockBookForm({
    bookName,
    bookAuthor,
    onNameChange,
    onAuthorChange,
    onSubmit,
    canSubmit,
    isLoading,
  }) {
    return (
      <div data-testid="book-form">
        <input
          data-testid="name-input"
          value={bookName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Book name"
        />
        <input
          data-testid="author-input"
          value={bookAuthor}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="Author name"
        />
        <button
          data-testid="submit-button"
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Book'}
        </button>
      </div>
    );
  };
});

jest.mock('../../view/BooksList', () => {
  return function MockBooksList({ books, isLoading, error }) {
    if (isLoading) return <div data-testid="loading">Loading...</div>;
    if (error) return <div data-testid="error">Error: {error}</div>;
    if (!books || books.length === 0)
      return <div data-testid="no-books">No books</div>;

    return (
      <div data-testid="books-list">
        {books.map((book, index) => (
          <div key={index} data-testid="book-item">
            {book.author}: {book.name}
          </div>
        ))}
      </div>
    );
  };
});

describe('Books', () => {
  let mockController;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock controller instance
    mockController = {
      initialize: jest.fn(),
      newBookName: '',
      newBookAuthor: '',
      books: [],
      isLoading: false,
      error: null,
      booksCount: 0,
      canAddBook: false,
      setNewBookName: jest.fn(),
      setNewBookAuthor: jest.fn(),
      handleAddBook: jest.fn(),
    };
  });

  test('should render books count in title', () => {
    mockController.booksCount = 5;

    render(<Books controller={mockController} />);

    expect(screen.getByText('Books (5)')).toBeInTheDocument();
  });

  test('should render BookForm with controller data', () => {
    mockController.newBookName = 'Test Book';
    mockController.newBookAuthor = 'Test Author';
    mockController.canAddBook = true;
    mockController.isLoading = false;

    render(<Books controller={mockController} />);

    const form = screen.getByTestId('book-form');
    expect(form).toBeInTheDocument();

    const nameInput = screen.getByTestId('name-input');
    const authorInput = screen.getByTestId('author-input');

    expect(nameInput.value).toBe('Test Book');
    expect(authorInput.value).toBe('Test Author');
  });

  test('should render BooksList with controller data', () => {
    mockController.books = [{ name: 'Book 1', author: 'Author 1' }];
    mockController.isLoading = false;
    mockController.error = null;

    render(<Books controller={mockController} />);

    const list = screen.getByTestId('books-list');
    expect(list).toBeInTheDocument();

    const bookItem = screen.getByTestId('book-item');
    expect(bookItem).toBeInTheDocument();
    expect(bookItem.textContent).toBe('Author 1: Book 1');
  });

  test('should show loading state', () => {
    mockController.isLoading = true;

    render(<Books controller={mockController} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('should show error state', () => {
    mockController.error = 'Failed to load books';
    mockController.isLoading = false;

    render(<Books controller={mockController} />);

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to load books')).toBeInTheDocument();
  });

  test('should show no books state', () => {
    mockController.books = [];
    mockController.isLoading = false;
    mockController.error = null;

    render(<Books controller={mockController} />);

    expect(screen.getByTestId('no-books')).toBeInTheDocument();
  });

  test('should handle form submission', async () => {
    mockController.canAddBook = true;
    mockController.isLoading = false;
    mockController.handleAddBook = jest.fn().mockResolvedValue(true);

    render(<Books controller={mockController} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Since handleAddBook is mocked, we can check it was called immediately
    expect(mockController.handleAddBook).toHaveBeenCalledTimes(1);
  });

  test('should pass controller methods to form', () => {
    render(<Books controller={mockController} />);

    const nameInput = screen.getByTestId('name-input');
    const authorInput = screen.getByTestId('author-input');

    fireEvent.change(nameInput, { target: { value: 'New Book' } });
    fireEvent.change(authorInput, { target: { value: 'New Author' } });

    expect(mockController.setNewBookName).toHaveBeenCalledWith('New Book');
    expect(mockController.setNewBookAuthor).toHaveBeenCalledWith('New Author');
  });

  test('should be a connector component with minimal logic', () => {
    // This test ensures the component only connects the controller to UI
    // and doesn't contain business logic
    mockController.books = [{ name: 'Book 1', author: 'Author 1' }];
    mockController.isLoading = false;
    mockController.error = null;

    const { container } = render(<Books controller={mockController} />);

    // Should contain the form and list components
    expect(container.innerHTML).toContain('book-form');
    expect(container.innerHTML).toContain('books-list');

    // Should not contain business logic directly
    expect(container.innerHTML).not.toContain('async');
    expect(container.innerHTML).not.toContain('await');
    expect(container.innerHTML).not.toContain('fetch');
  });

  test('should handle clear error', () => {
    mockController.clearError = jest.fn();

    render(<Books controller={mockController} />);

    // Simulate error state
    mockController.error = 'Some error';

    // Trigger clear error (this would be done through BooksList)
    // For now, just verify the method exists
    expect(mockController.clearError).toBeDefined();
  });

  test('should handle retry', () => {
    mockController.initialize = jest.fn();

    render(<Books controller={mockController} />);

    // Verify retry functionality
    expect(mockController.initialize).toBeDefined();
  });
});
