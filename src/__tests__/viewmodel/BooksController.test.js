import BooksController from '../../viewmodel/BooksController';
import booksStore from '../../store/BooksStore';

// Mock the booksStore
jest.mock('../../store/BooksStore');

describe('BooksController', () => {
  let controller;

  beforeEach(() => {
    // Create a fresh instance for each test
    controller = new BooksController();

    // Reset all mocks
    jest.clearAllMocks();

    // Mock booksStore methods and properties
    booksStore.loadBooks = jest.fn();
    booksStore.addBook = jest.fn();
    booksStore.error = null;
    booksStore.isLoading = false;
    booksStore.books = [];

    // Mock computed properties
    Object.defineProperty(booksStore, 'hasBooks', {
      get: jest.fn().mockReturnValue(false),
      configurable: true,
    });
    Object.defineProperty(booksStore, 'booksCount', {
      get: jest.fn().mockReturnValue(0),
      configurable: true,
    });
  });

  describe('Input handling', () => {
    test('should set new book name', () => {
      controller.setNewBookName('Test Book');
      expect(controller.newBookName).toBe('Test Book');
    });

    test('should set new book author', () => {
      controller.setNewBookAuthor('Test Author');
      expect(controller.newBookAuthor).toBe('Test Author');
    });
  });

  describe('Form validation', () => {
    test('should return false for empty form', () => {
      expect(controller.isFormValid).toBe(false);
    });

    test('should return false for only book name', () => {
      controller.setNewBookName('Test Book');
      expect(controller.isFormValid).toBe(false);
    });

    test('should return false for only author', () => {
      controller.setNewBookAuthor('Test Author');
      expect(controller.isFormValid).toBe(false);
    });

    test('should return false for whitespace only', () => {
      controller.setNewBookName('   ');
      controller.setNewBookAuthor('   ');
      expect(controller.isFormValid).toBe(false);
    });

    test('should return true for valid form', () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      expect(controller.isFormValid).toBe(true);
    });
  });

  describe('Can add book', () => {
    test('should return false when form is invalid', () => {
      expect(controller.canAddBook).toBe(false);
    });

    test('should return false when loading', () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      booksStore.isLoading = true;
      expect(controller.canAddBook).toBe(false);
    });

    test('should return true when form is valid and not loading', () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      expect(controller.canAddBook).toBe(true);
    });
  });

  describe('Initialize', () => {
    test('should call booksStore.loadBooks', async () => {
      await controller.initialize();
      expect(booksStore.loadBooks).toHaveBeenCalledTimes(1);
    });
  });

  describe('Handle add book', () => {
    test('should return false for invalid form', async () => {
      const result = await controller.handleAddBook();
      expect(result).toBe(false);
      expect(booksStore.addBook).not.toHaveBeenCalled();
    });

    test('should call booksStore.addBook for valid form', async () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      booksStore.addBook.mockResolvedValue(true);
      booksStore.error = null;

      const result = await controller.handleAddBook();

      expect(booksStore.addBook).toHaveBeenCalledWith(
        'Test Book',
        'Test Author'
      );
      expect(result).toBe(true);
    });

    test('should clear form after successful add', async () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      booksStore.addBook.mockResolvedValue(true);
      booksStore.error = null;

      await controller.handleAddBook();

      expect(controller.newBookName).toBe('');
      expect(controller.newBookAuthor).toBe('');
    });

    test('should not clear form after failed add', async () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');
      booksStore.addBook.mockResolvedValue(false);
      booksStore.error = 'Failed to add book';

      const result = await controller.handleAddBook();

      expect(result).toBe(false);
      expect(controller.newBookName).toBe('Test Book');
      expect(controller.newBookAuthor).toBe('Test Author');
    });

    test('should handle error from booksStore', async () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');

      // Mock the addBook method to resolve but set error
      booksStore.addBook.mockResolvedValue(undefined);
      booksStore.error = 'Network error';

      const result = await controller.handleAddBook();

      expect(result).toBe(false);
      expect(controller.newBookName).toBe('Test Book');
      expect(controller.newBookAuthor).toBe('Test Author');
    });
  });

  describe('Clear form', () => {
    test('should clear both name and author', () => {
      controller.setNewBookName('Test Book');
      controller.setNewBookAuthor('Test Author');

      controller.clearForm();

      expect(controller.newBookName).toBe('');
      expect(controller.newBookAuthor).toBe('');
    });
  });

  describe('Computed properties', () => {
    test('should return books from store', () => {
      const mockBooks = [{ name: 'Book 1', author: 'Author 1' }];
      booksStore.books = mockBooks;

      expect(controller.books).toEqual(mockBooks);
    });

    test('should return private books when isShowingAllBooks is false', () => {
      const mockPrivateBooks = [{ name: 'Private Book 1', author: 'Author 1' }];
      booksStore.privateBooks = mockPrivateBooks;
      controller.setShowAllBooks(false);

      expect(controller.books).toEqual(mockPrivateBooks);
    });

    test('should return all books when isShowingAllBooks is true', () => {
      const mockAllBooks = [{ name: 'Book 1', author: 'Author 1' }];
      const mockPrivateBooks = [{ name: 'Private Book 1', author: 'Author 1' }];
      booksStore.books = mockAllBooks;
      booksStore.privateBooks = mockPrivateBooks;
      controller.setShowAllBooks(true);

      expect(controller.books).toEqual(mockAllBooks);
    });

    test('should return loading state from store', () => {
      booksStore.isLoading = true;
      expect(controller.isLoading).toBe(true);
    });

    test('should return error from store', () => {
      booksStore.error = 'Test error';
      expect(controller.error).toBe('Test error');
    });

    test('should return hasBooks based on books length', () => {
      booksStore.books = [{ name: 'Book 1', author: 'Author 1' }];
      expect(controller.hasBooks).toBe(true);

      booksStore.books = [];
      expect(controller.hasBooks).toBe(false);
    });

    test('should return booksCount based on books length', () => {
      booksStore.books = [{ name: 'Book 1', author: 'Author 1' }];
      expect(controller.booksCount).toBe(1);

      booksStore.books = [];
      expect(controller.booksCount).toBe(0);
    });

    test('should return privateBooksCount from store', () => {
      Object.defineProperty(booksStore, 'privateBooksCount', {
        get: jest.fn().mockReturnValue(5),
        configurable: true,
      });
      expect(controller.privateBooksCount).toBe(5);
    });
  });
});
