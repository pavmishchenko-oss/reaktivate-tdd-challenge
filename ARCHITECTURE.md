# Architecture Documentation

## Overview

This project implements a **Model-View-Presenter (MVP)** architecture pattern with MobX for state management. The architecture follows the diagram provided, with clear separation of concerns between different layers.

## Architecture Pattern

The application follows the MVP pattern as shown in the diagram:

```
View → Controller → Repository → Services/Gateways
 ↑         ↓         ↓
VM (observable) ← PM ← DTO
```

### Components

1. **View Layer** - React components that handle UI rendering
2. **Controller (Presenter)** - Manages business logic and coordinates between View and Repository
3. **Repository** - Abstracts data access and handles data transformation
4. **Services/Gateways** - Handle external API communication

## Key Features Implemented

### 1. Sticky Header with Private Books Counter
- **Component**: `Header.tsx`
- **Feature**: Displays "Your books: X" counter
- **Position**: Sticky at the top of the application
- **Data Source**: `BooksController.privateBooksCount`

### 2. Books Filter Switch
- **Component**: `BooksFilter.tsx`
- **Feature**: Toggle between "All books" and "Private books"
- **Behavior**: Mutually exclusive selection (radio button style)
- **State Management**: `BooksController.isShowingAllBooks`

### 3. Enhanced Data Management
- **All Books**: Fetched from `/books/{USER}/` endpoint (all user's books)
- **Private Books**: Fetched from `/books/{USER}/private` endpoint (only private books)
- **Dynamic Filtering**: Controller switches between data sources based on user selection

## File Structure

```
src/
├── view/                    # View Layer
│   ├── Header.tsx          # Sticky header with counter
│   ├── BooksFilter.tsx     # Books filter switch
│   ├── Books.tsx           # Main books view
│   ├── BooksContainer.tsx  # Container component
│   └── ...                 # Other view components
├── viewmodel/              # Controller Layer (Presenter)
│   └── BooksController.ts  # Main business logic controller
├── store/                  # Model Layer
│   └── BooksStore.ts       # MobX store for books data
├── services/               # Repository Layer
│   ├── Books.repository.ts # Data access abstraction
│   └── ApiGateway.ts       # HTTP communication
└── types/                  # Type definitions
    └── Book.ts            # Book-related interfaces
```

## Data Flow

1. **User Interaction**: User clicks filter tabs or adds books
2. **View**: React components capture user actions
3. **Controller**: `BooksController` processes business logic
4. **Store**: `BooksStore` manages application state via MobX
5. **Repository**: `BooksRepository` handles data persistence
6. **API Gateway**: `ApiGateway` communicates with external services

## State Management

### MobX Store (`BooksStore`)
- **Observable Properties**: `books`, `privateBooks`, `isLoading`, `error`
- **Actions**: `loadBooks()`, `addBook()`
- **Computed Properties**: `hasBooks`, `booksCount`, `privateBooksCount`

### Controller (`BooksController`)
- **Local State**: `newBookName`, `newBookAuthor`, `isShowingAllBooks`
- **Computed Properties**: `books` (filtered based on selection), `privateBooksCount`
- **Actions**: `setShowAllBooks()`, `handleAddBook()`, `initialize()`

## API Endpoints

- **GET** `/books/{USER}/` - Fetch all books for a specific user
- **GET** `/books/{USER}/private` - Fetch only private books for a specific user
- **POST** `/books/{USER}/` - Add a new book for a specific user

## Testing

The application includes comprehensive tests for all layers:
- **View Tests**: Component rendering and user interactions
- **Controller Tests**: Business logic and state management
- **Store Tests**: Data operations and MobX observables
- **Repository Tests**: Data access and API integration

## Benefits of This Architecture

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data access
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features or modify existing ones
5. **Reusability**: Components and logic can be reused across the application

## Future Enhancements

- Add authentication and user management
- Implement book categories and advanced filtering
- Add offline support with local storage
- Implement real-time updates via WebSocket
- Add book search and pagination
