import React from 'react';
import { observer } from 'mobx-react';
import BooksList from './BooksList';
import BookForm from './BookForm';
import Header from './Header';
import BooksFilter from './BooksFilter';
import { BooksController } from '../viewmodel/BooksController';

interface BooksProps {
  controller: BooksController;
}

const Books: React.FC<BooksProps> = observer(({ controller }) => {
  return (
    <div className="app">
      <Header controller={controller} />
      
      <div className="books-container">
        <h1>Books ({controller.booksCount})</h1>

        <BooksFilter controller={controller} />

        <BookForm
          bookName={controller.newBookName}
          bookAuthor={controller.newBookAuthor}
          onNameChange={controller.setNewBookName.bind(controller)}
          onAuthorChange={controller.setNewBookAuthor.bind(controller)}
          onSubmit={controller.handleAddBook.bind(controller)}
          canSubmit={controller.canAddBook}
          isLoading={controller.isLoading}
        />

        <BooksList
          books={controller.books}
          isLoading={controller.isLoading}
          error={controller.error}
        />
      </div>
    </div>
  );
});

export default Books;
