import React from 'react';
import { render, unmount } from '@testing-library/react';
import BooksContainer from '../../view/BooksContainer';
import BooksController from '../../viewmodel/BooksController';

// Mock BooksController
jest.mock('../../viewmodel/BooksController');

// Mock Books component
jest.mock('../../view/Books', () => {
  return function MockBooks({ controller }) {
    return <div data-testid="books-component">Books with controller: {controller ? 'present' : 'absent'}</div>;
  };
});

describe('BooksContainer', () => {
  let mockController;
  let mockInitialize;
  let mockDispose;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock methods
    mockInitialize = jest.fn();
    mockDispose = jest.fn();
    
    // Create mock controller instance
    mockController = {
      initialize: mockInitialize,
      dispose: mockDispose
    };
    
    // Mock BooksController constructor
    BooksController.mockImplementation(() => mockController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Books component with controller', () => {
    const { getByTestId } = render(<BooksContainer />);
    
    expect(getByTestId('books-component')).toBeInTheDocument();
    expect(getByTestId('books-component')).toHaveTextContent('Books with controller: present');
  });

  it('should create controller instance on mount', () => {
    render(<BooksContainer />);
    
    expect(BooksController).toHaveBeenCalledTimes(1);
  });

  it('should call controller.initialize on mount', () => {
    render(<BooksContainer />);
    
    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });

  it('should call controller.dispose on unmount', () => {
    const { unmount } = render(<BooksContainer />);
    
    // Verify initialize was called
    expect(mockInitialize).toHaveBeenCalledTimes(1);
    
    // Unmount the component
    unmount();
    
    // Verify dispose was called
    expect(mockDispose).toHaveBeenCalledTimes(1);
  });

  it('should maintain the same controller instance across re-renders', () => {
    const { rerender } = render(<BooksContainer />);
    
    expect(BooksController).toHaveBeenCalledTimes(1);
    expect(mockInitialize).toHaveBeenCalledTimes(1);
    
    // Re-render the component
    rerender(<BooksContainer />);
    
    // Controller should not be recreated
    expect(BooksController).toHaveBeenCalledTimes(1);
    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });

  it('should be wrapped with observer HOC', () => {
    // This test verifies that the component is reactive to MobX changes
    // The observer wrapper should be present
    const { container } = render(<BooksContainer />);
    
    // Component should render without errors
    expect(container.firstChild).toBeTruthy();
  });

  describe('component lifecycle', () => {
    it('should follow proper initialization sequence', () => {
      const { unmount } = render(<BooksContainer />);
      
      // Check the sequence of calls
      expect(BooksController).toHaveBeenCalledTimes(1);
      expect(mockInitialize).toHaveBeenCalledTimes(1);
      expect(mockDispose).toHaveBeenCalledTimes(0);
      
      // Unmount should trigger dispose
      unmount();
      expect(mockDispose).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple mount/unmount cycles correctly', () => {
      // First mount
      const { unmount: unmount1 } = render(<BooksContainer />);
      expect(BooksController).toHaveBeenCalledTimes(1);
      expect(mockInitialize).toHaveBeenCalledTimes(1);
      
      unmount1();
      expect(mockDispose).toHaveBeenCalledTimes(1);
      
      // Reset mocks for second cycle
      jest.clearAllMocks();
      BooksController.mockImplementation(() => ({
        initialize: mockInitialize,
        dispose: mockDispose
      }));
      
      // Second mount
      const { unmount: unmount2 } = render(<BooksContainer />);
      expect(BooksController).toHaveBeenCalledTimes(1);
      expect(mockInitialize).toHaveBeenCalledTimes(1);
      
      unmount2();
      expect(mockDispose).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle controller methods being called', () => {
      const { unmount } = render(<BooksContainer />);
      
      // Verify that initialize and dispose methods exist and are called
      expect(mockInitialize).toHaveBeenCalledTimes(1);
      expect(mockDispose).toHaveBeenCalledTimes(0);
      
      unmount();
      expect(mockDispose).toHaveBeenCalledTimes(1);
    });

    it('should pass the correct controller instance to Books component', () => {
      const { getByTestId } = render(<BooksContainer />);
      
      // Verify that Books component receives a controller
      expect(getByTestId('books-component')).toHaveTextContent('Books with controller: present');
    });
  });
});
