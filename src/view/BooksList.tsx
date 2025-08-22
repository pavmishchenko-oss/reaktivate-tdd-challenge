import React from 'react';
import { observer } from 'mobx-react';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import BooksContent from './BooksContent';
import { Book } from '../types/Book';

interface BooksListProps {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}

const BooksList: React.FC<BooksListProps> = observer(({ books, isLoading, error }) => {
  if (isLoading) {
    return <LoadingState message="Loading books..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!books || books.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="No books found"
        subtitle="Start by adding your first book"
      />
    );
  }

  return <BooksContent books={books} />;
});

export default BooksList;
