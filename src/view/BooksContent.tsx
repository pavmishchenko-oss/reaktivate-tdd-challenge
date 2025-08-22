import React from 'react';
import BookItem from './BookItem';
import { Book } from '../types/Book';

interface BooksContentProps {
  books: Book[];
}

const BooksContent = ({ books }: BooksContentProps) => (
  <div className="books-list">
    {books.map((book: Book) => (
      <BookItem key={book.id || `${book.name}-${book.author}`} book={book} />
    ))}
  </div>
);

export default BooksContent;
