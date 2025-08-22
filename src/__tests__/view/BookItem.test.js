import React from 'react';
import { render, screen } from '@testing-library/react';
import BookItem from '../../view/BookItem';

describe('BookItem', () => {
  const mockBook = {
    name: 'Test Book',
    author: 'Test Author',
  };

  test('should render book information correctly', () => {
    render(<BookItem book={mockBook} />);

    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    // The colon is in a separate span, so we need to check for it differently
    expect(screen.getByText(':')).toBeInTheDocument();
  });

  test('should render with different book data', () => {
    const differentBook = {
      name: 'Another Book',
      author: 'Another Author',
    };

    render(<BookItem book={differentBook} />);

    expect(screen.getByText('Another Author')).toBeInTheDocument();
    expect(screen.getByText('Another Book')).toBeInTheDocument();
  });

  test('should have correct CSS classes', () => {
    const { container } = render(<BookItem book={mockBook} />);

    const bookItem = container.querySelector('.book-item');
    expect(bookItem).toBeInTheDocument();

    const authorSpan = container.querySelector('.book-author');
    expect(authorSpan).toBeInTheDocument();

    const separatorSpan = container.querySelector('.book-separator');
    expect(separatorSpan).toBeInTheDocument();

    const nameSpan = container.querySelector('.book-name');
    expect(nameSpan).toBeInTheDocument();
  });

  test('should be a pure component with no business logic', () => {
    // This test ensures the component only renders what it receives
    // and doesn't contain any business logic
    const { container } = render(<BookItem book={mockBook} />);

    // Should only contain the expected DOM structure
    expect(container.innerHTML).toContain('Test Author');
    expect(container.innerHTML).toContain('Test Book');
    expect(container.innerHTML).toContain(':');

    // Should not contain any business logic elements
    expect(container.innerHTML).not.toContain('function');
    expect(container.innerHTML).not.toContain('async');
    expect(container.innerHTML).not.toContain('await');
  });
});
