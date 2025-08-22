import { BooksStore } from '../../store/BooksStore';
import booksRepository from '../../services/Books.repository';

// Mock the booksRepository
jest.mock('../../services/Books.repository');

describe('BooksStore', () => {
  let store;

  beforeEach(() => {
    // Create a fresh instance for each test
    store = new BooksStore();

    // Reset all mocks
    jest.clearAllMocks();

    // Mock booksRepository methods
    booksRepository.getAllBooks = jest.fn();
    booksRepository.getPrivateBooks = jest.fn();
    booksRepository.addBook = jest.fn();
  });

  describe('Initial state', () => {
    test('should have empty books array', () => {
      expect(store.books).toEqual([]);
    });

    test('should have empty privateBooks array', () => {
      expect(store.privateBooks).toEqual([]);
    });

    test('should not be loading initially', () => {
      expect(store.isLoading).toBe(false);
    });

    test('should have no error initially', () => {
      expect(store.error).toBe(null);
    });
  });

  describe('Load books', () => {
    test('should set loading to true when starting', async () => {
      booksRepository.getAllBooks.mockResolvedValue([]);
      booksRepository.getPrivateBooks.mockResolvedValue([]);

      const loadPromise = store.loadBooks();

      expect(store.isLoading).toBe(true);
      expect(store.error).toBe(null);

      await loadPromise;
    });

    test('should load books successfully', async () => {
      const mockAllBooks = [
        { name: 'Book 1', author: 'Author 1' },
        { name: 'Book 2', author: 'Author 2' },
      ];
      const mockPrivateBooks = [
        { name: 'Private Book 1', author: 'Author 1' },
      ];
      
      booksRepository.getAllBooks.mockResolvedValue(mockAllBooks);
      booksRepository.getPrivateBooks.mockResolvedValue(mockPrivateBooks);

      await store.loadBooks();

      expect(store.books).toEqual(mockAllBooks);
      expect(store.privateBooks).toEqual(mockPrivateBooks);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
      expect(booksRepository.getAllBooks).toHaveBeenCalledTimes(1);
      expect(booksRepository.getPrivateBooks).toHaveBeenCalledTimes(1);
    });

    test('should handle error when loading books', async () => {
      const errorMessage = 'Network error';
      booksRepository.getAllBooks.mockRejectedValue(new Error(errorMessage));

      await store.loadBooks();

      expect(store.error).toBe(
        'Failed to load books. Please refresh the page.'
      );
      expect(store.isLoading).toBe(false);
      expect(store.books).toEqual([]);
      expect(store.privateBooks).toEqual([]);
    });
  });

  describe('Add book', () => {
    test('should set loading to true when starting', async () => {
      booksRepository.addBook.mockResolvedValue(true);
      booksRepository.getAllBooks.mockResolvedValue([]);
      booksRepository.getPrivateBooks.mockResolvedValue([]);

      const addPromise = store.addBook('Test Book', 'Test Author');

      expect(store.isLoading).toBe(true);
      expect(store.error).toBe(null);

      await addPromise;
    });

    test('should add book successfully', async () => {
      booksRepository.addBook.mockResolvedValue(true);
      booksRepository.getAllBooks.mockResolvedValue([
        { name: 'Test Book', author: 'Test Author' },
      ]);
      booksRepository.getPrivateBooks.mockResolvedValue([
        { name: 'Test Book', author: 'Test Author' },
      ]);

      await store.addBook('Test Book', 'Test Author');

      expect(booksRepository.addBook).toHaveBeenCalledWith({
        name: 'Test Book',
        author: 'Test Author',
      });
      expect(booksRepository.getAllBooks).toHaveBeenCalledTimes(1);
      expect(booksRepository.getPrivateBooks).toHaveBeenCalledTimes(1);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    test('should handle failed book addition', async () => {
      booksRepository.addBook.mockResolvedValue(false);

      await store.addBook('Test Book', 'Test Author');

      expect(store.error).toBe('Failed to add book. Please try again.');
      expect(store.isLoading).toBe(false);
      expect(booksRepository.getAllBooks).not.toHaveBeenCalled();
      expect(booksRepository.getPrivateBooks).not.toHaveBeenCalled();
    });

    test('should handle error when adding book', async () => {
      const errorMessage = 'Network error';
      booksRepository.addBook.mockRejectedValue(new Error(errorMessage));

      await store.addBook('Test Book', 'Test Author');

      expect(store.error).toBe(
        'Failed to add book. Please check your internet connection.'
      );
      expect(store.isLoading).toBe(false);
      expect(booksRepository.getAllBooks).not.toHaveBeenCalled();
      expect(booksRepository.getPrivateBooks).not.toHaveBeenCalled();
    });
  });

  describe('Computed properties', () => {
    test('should return hasBooks correctly', () => {
      expect(store.hasBooks).toBe(false);

      store.books = [{ name: 'Book 1', author: 'Author 1' }];
      expect(store.hasBooks).toBe(true);

      store.books = [];
      expect(store.hasBooks).toBe(false);
    });

    test('should return booksCount correctly', () => {
      expect(store.booksCount).toBe(0);

      store.books = [{ name: 'Book 1', author: 'Author 1' }];
      expect(store.booksCount).toBe(1);

      store.books = [
        { name: 'Book 1', author: 'Author 1' },
        { name: 'Book 2', author: 'Author 2' },
      ];
      expect(store.booksCount).toBe(2);
    });

    test('should return privateBooksCount correctly', () => {
      expect(store.privateBooksCount).toBe(0);

      store.privateBooks = [{ name: 'Private Book 1', author: 'Author 1' }];
      expect(store.privateBooksCount).toBe(1);

      store.privateBooks = [
        { name: 'Private Book 1', author: 'Author 1' },
        { name: 'Private Book 2', author: 'Author 2' },
      ];
      expect(store.privateBooksCount).toBe(2);
    });
  });

  describe('State mutations', () => {
    test('should be observable', () => {
      const originalBooks = store.books;
      const originalPrivateBooks = store.privateBooks;
      const originalLoading = store.isLoading;
      const originalError = store.error;

      // These should trigger observable updates
      store.books = [{ name: 'New Book', author: 'New Author' }];
      store.privateBooks = [{ name: 'New Private Book', author: 'New Author' }];
      store.isLoading = true;
      store.error = 'New error';

      expect(store.books).not.toBe(originalBooks);
      expect(store.privateBooks).not.toBe(originalPrivateBooks);
      expect(store.isLoading).not.toBe(originalLoading);
      expect(store.error).not.toBe(originalError);
    });
  });
});
