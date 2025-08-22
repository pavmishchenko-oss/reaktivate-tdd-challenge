import React from 'react';
import { Book } from '../types/Book';

interface BookItemProps {
  book: Book;
}

const BookItem = ({ book }: BookItemProps) => {
  return (
    <div className="book-item">
      <span className="book-author">{book.author}</span>
      <span className="book-separator">: </span>
      <span className="book-name">{book.name}</span>
    </div>
  );
};

export default BookItem;
