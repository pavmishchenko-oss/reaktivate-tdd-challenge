import React from 'react';
import { observer } from 'mobx-react';
import { BooksController } from '../viewmodel/BooksController';

interface HeaderProps {
  controller: BooksController;
}

const Header: React.FC<HeaderProps> = observer(({ controller }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Books App</h1>
        <div className="header-counter">
          Your books: {controller.privateBooksCount}
        </div>
      </div>
    </header>
  );
});

export default Header;
