import React from 'react';

interface BookFormProps {
  bookName: string;
  bookAuthor: string;
  onNameChange: (name: string) => void;
  onAuthorChange: (author: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  isLoading: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  bookName,
  bookAuthor,
  onNameChange,
  onAuthorChange,
  onSubmit,
  canSubmit,
  isLoading,
}) => {
  return (
    <div className="book-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="Book name"
          value={bookName}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={isLoading}
          className="form-input"
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="Author name"
          value={bookAuthor}
          onChange={(e) => onAuthorChange(e.target.value)}
          disabled={isLoading}
          className="form-input"
        />
      </div>
      <div className="form-row">
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
          className="form-button"
        >
          {isLoading ? 'Adding...' : 'Add Book'}
        </button>
      </div>
    </div>
  );
};

export default BookForm;
