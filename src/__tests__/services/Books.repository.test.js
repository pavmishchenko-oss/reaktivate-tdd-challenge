import booksRepository from '../../services/Books.repository';

// Mock ApiGateway
jest.mock('../../services/ApiGateway', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  
  const MockApiGateway = jest.fn().mockImplementation(() => ({
    get: mockGet,
    post: mockPost
  }));
  
  // Attach mock functions to the constructor for access in tests
  MockApiGateway.mockGet = mockGet;
  MockApiGateway.mockPost = mockPost;
  
  return MockApiGateway;
});

describe('BooksRepository', () => {
  let mockGet, mockPost;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Get references to mock functions
    const ApiGateway = require('../../services/ApiGateway');
    mockGet = ApiGateway.mockGet;
    mockPost = ApiGateway.mockPost;
  });

  describe('getAllBooks', () => {
    it('should fetch all books successfully', async () => {
      const mockBooks = [
        { id: '1', name: 'Book 1', author: 'Author 1' },
        { id: '2', name: 'Book 2', author: 'Author 2' }
      ];
      
      mockGet.mockResolvedValue(mockBooks);

      const result = await booksRepository.getAllBooks();
      
      expect(mockGet).toHaveBeenCalledWith('/books/postnikov/');
      expect(result).toEqual(mockBooks);
    });

    it('should handle API errors when fetching all books', async () => {
      const apiError = new Error('API Error');
      mockGet.mockRejectedValue(apiError);

      await expect(booksRepository.getAllBooks()).rejects.toThrow('API Error');
      expect(mockGet).toHaveBeenCalledWith('/books/postnikov/');
    });
  });

  describe('getPrivateBooks', () => {
    it('should fetch private books successfully', async () => {
      const mockPrivateBooks = [
        { id: '1', name: 'Private Book 1', author: 'Author 1' }
      ];
      
      mockGet.mockResolvedValue(mockPrivateBooks);

      const result = await booksRepository.getPrivateBooks();
      
      expect(mockGet).toHaveBeenCalledWith('/books/postnikov/private');
      expect(result).toEqual(mockPrivateBooks);
    });

    it('should handle API errors when fetching private books', async () => {
      const apiError = new Error('API Error');
      mockGet.mockRejectedValue(apiError);

      await expect(booksRepository.getPrivateBooks()).rejects.toThrow('API Error');
      expect(mockGet).toHaveBeenCalledWith('/books/postnikov/private');
    });
  });

  describe('addBook', () => {
    it('should add book successfully when API returns success status', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      const mockResponse = { status: 'ok', message: 'Book added successfully' };
      
      mockPost.mockResolvedValue(mockResponse);

      const result = await booksRepository.addBook(bookData);
      
      expect(mockPost).toHaveBeenCalledWith('/books/postnikov/', bookData);
      expect(result).toBe(true);
    });

    it('should return false when API returns error status', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      const mockResponse = { status: 'error', message: 'Book already exists' };
      
      mockPost.mockResolvedValue(mockResponse);

      const result = await booksRepository.addBook(bookData);
      
      expect(mockPost).toHaveBeenCalledWith('/books/postnikov/', bookData);
      expect(result).toBe(false);
    });

    it('should return false when API response is falsy', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      mockPost.mockResolvedValue(null);

      const result = await booksRepository.addBook(bookData);
      
      expect(mockPost).toHaveBeenCalledWith('/books/postnikov/', bookData);
      expect(result).toBe(false);
    });

    it('should handle API errors when adding book', async () => {
      const bookData = { name: 'New Book', author: 'New Author' };
      const apiError = new Error('API Error');
      mockPost.mockRejectedValue(apiError);

      await expect(booksRepository.addBook(bookData)).rejects.toThrow('API Error');
      expect(mockPost).toHaveBeenCalledWith('/books/postnikov/', bookData);
    });
  });

  describe('API endpoint consistency', () => {
    it('should use correct user ID from config', async () => {
      // This test ensures we're using the correct user ID
      // The actual user ID comes from config.ts
      mockGet.mockResolvedValue([]);
      
      await booksRepository.getAllBooks();
      await booksRepository.getPrivateBooks();
      
      // Check that all calls use the same user ID pattern
      expect(mockGet).toHaveBeenCalledWith('/books/postnikov/');
      expect(mockGet).toHaveBeenCalledWith('/books/postnikov/private');
    });
  });
});
