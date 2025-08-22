import React from 'react';
import { observer } from 'mobx-react';
import { BooksController } from '../viewmodel/BooksController';

interface BooksFilterProps {
  controller: BooksController;
}

const BooksFilter: React.FC<BooksFilterProps> = observer(({ controller }) => {
  return (
    <div className="books-filter">
      <div className="filter-tabs">
        <button
          className={`filter-tab ${controller.isShowingAllBooks ? 'active' : ''}`}
          onClick={() => controller.setShowAllBooks(true)}
        >
          All books
        </button>
        <button
          className={`filter-tab ${!controller.isShowingAllBooks ? 'active' : ''}`}
          onClick={() => controller.setShowAllBooks(false)}
        >
          Private books
        </button>
      </div>
    </div>
  );
});

export default BooksFilter;
