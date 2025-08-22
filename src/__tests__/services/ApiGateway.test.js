import ApiGateway from '../../services/ApiGateway';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiGateway', () => {
  let apiGateway;
  let mockFetch;

  beforeEach(() => {
    apiGateway = new ApiGateway();
    mockFetch = global.fetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleResponse', () => {
    it('should return JSON data for successful response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ books: [] })
      };

      const result = await apiGateway.handleResponse(mockResponse);
      expect(result).toEqual({ books: [] });
    });

    it('should throw error for non-OK response with JSON error', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({ message: 'Invalid input' })
      };

      await expect(apiGateway.handleResponse(mockResponse)).rejects.toThrow('Invalid input');
    });

    it('should throw error for non-OK response with HTML response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Parse error')),
        text: jest.fn().mockResolvedValue('<!DOCTYPE html><html>Error</html>')
      };

      await expect(apiGateway.handleResponse(mockResponse)).rejects.toThrow(
        'API endpoint returned HTML instead of JSON. Please check the API configuration.'
      );
    });

    it('should throw error for non-OK response with text error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockRejectedValue(new Error('Parse error')),
        text: jest.fn().mockResolvedValue('Resource not found')
      };

      await expect(apiGateway.handleResponse(mockResponse)).rejects.toThrow(
        'API Error: Resource not found'
      );
    });

    it('should throw error for non-OK response with fallback error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Parse error')),
        text: jest.fn().mockRejectedValue(new Error('Text error'))
      };

      await expect(apiGateway.handleResponse(mockResponse)).rejects.toThrow(
        'Request failed with status 500'
      );
    });

    it('should throw error for invalid JSON response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      };

      await expect(apiGateway.handleResponse(mockResponse)).rejects.toThrow(
        'Invalid JSON response from server'
      );
    });
  });

  describe('get', () => {
    it('should make successful GET request', async () => {
      const mockData = { books: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      });

      const result = await apiGateway.get('/books/');
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('https://tdd.demo.reaktivate.com/v1/books/');
    });

    it('should handle GET request error', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(apiGateway.get('/books/')).rejects.toThrow(
        'GET request failed: Network error'
      );
    });
  });

  describe('post', () => {
    it('should make successful POST request', async () => {
      const payload = { name: 'Test Book', author: 'Test Author' };
      const mockData = { status: 'ok' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      });

      const result = await apiGateway.post('/books/', payload);
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('https://tdd.demo.reaktivate.com/v1/books/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    });

    it('should handle POST request error', async () => {
      const payload = { name: 'Test Book', author: 'Test Author' };
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(apiGateway.post('/books/', payload)).rejects.toThrow(
        'POST request failed: Network error'
      );
    });
  });
});
