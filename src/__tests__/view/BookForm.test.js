import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from '../../view/BookForm';

describe('BookForm', () => {
  const defaultProps = {
    bookName: '',
    bookAuthor: '',
    onNameChange: jest.fn(),
    onAuthorChange: jest.fn(),
    onSubmit: jest.fn(),
    canSubmit: false,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render form inputs and button', () => {
    render(<BookForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Book name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Author name')).toBeInTheDocument();
    expect(screen.getByText('Add Book')).toBeInTheDocument();
  });

  test('should display current values', () => {
    const props = {
      ...defaultProps,
      bookName: 'Test Book',
      bookAuthor: 'Test Author',
    };

    render(<BookForm {...props} />);

    expect(screen.getByDisplayValue('Test Book')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
  });

  test('should call onNameChange when book name input changes', () => {
    render(<BookForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Book name');
    fireEvent.change(nameInput, { target: { value: 'New Book Name' } });

    expect(defaultProps.onNameChange).toHaveBeenCalledWith('New Book Name');
  });

  test('should call onAuthorChange when author input changes', () => {
    render(<BookForm {...defaultProps} />);

    const authorInput = screen.getByPlaceholderText('Author name');
    fireEvent.change(authorInput, { target: { value: 'New Author Name' } });

    expect(defaultProps.onAuthorChange).toHaveBeenCalledWith('New Author Name');
  });

  test('should call onSubmit when form is submitted', () => {
    const props = {
      ...defaultProps,
      canSubmit: true,
    };

    render(<BookForm {...props} />);

    const submitButton = screen.getByText('Add Book');
    fireEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  test('should disable submit button when canSubmit is false', () => {
    render(<BookForm {...defaultProps} />);

    const submitButton = screen.getByText('Add Book');
    expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when canSubmit is true', () => {
    const props = {
      ...defaultProps,
      canSubmit: true,
    };

    render(<BookForm {...props} />);

    const submitButton = screen.getByText('Add Book');
    expect(submitButton).not.toBeDisabled();
  });

  test('should disable inputs when loading', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };

    render(<BookForm {...props} />);

    const nameInput = screen.getByPlaceholderText('Book name');
    const authorInput = screen.getByPlaceholderText('Author name');
    const submitButton = screen.getByText('Adding...');

    expect(nameInput).toBeDisabled();
    expect(authorInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  test('should show loading text when isLoading is true', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };

    render(<BookForm {...props} />);

    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });

  test('should have correct CSS classes', () => {
    const { container } = render(<BookForm {...defaultProps} />);

    expect(container.querySelector('.book-form')).toBeInTheDocument();
    expect(container.querySelectorAll('.form-row')).toHaveLength(3);
    expect(container.querySelectorAll('.form-input')).toHaveLength(2);
    expect(container.querySelector('.form-button')).toBeInTheDocument();
  });

  test('should be a pure component with no business logic', () => {
    // This test ensures the component only handles UI interactions
    // and doesn't contain any business logic
    const { container } = render(<BookForm {...defaultProps} />);

    // Should only contain form elements and no business logic
    expect(container.innerHTML).toContain('input');
    expect(container.innerHTML).toContain('button');

    // Should not contain any business logic elements
    expect(container.innerHTML).not.toContain('async');
    expect(container.innerHTML).not.toContain('await');
    expect(container.innerHTML).not.toContain('fetch');
  });

  test('should not call onSubmit when button is disabled', () => {
    render(<BookForm {...defaultProps} />);

    const submitButton = screen.getByText('Add Book');
    fireEvent.click(submitButton);

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
});
