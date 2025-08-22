import React from 'react';
import { observer } from 'mobx-react';
import BookItem from './BookItem';
import { Book } from '../types/Book';

interface BooksContentProps {
  books: Book[];
}

const BooksContent = observer(({ books }: BooksContentProps) => (
  <div className="books-list">
    {books.map((book: Book, index: number) => (
      <BookItem key={book.id || `${book.name}-${book.author}-${index}`} book={book} />
    ))}
  </div>
));

export default BooksContent;
