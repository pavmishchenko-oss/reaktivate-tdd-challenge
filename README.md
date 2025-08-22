# Books Management App

A React TypeScript application for managing books, built with MVP/MVVM architecture using MobX for state management.

## 🏗️ Architecture

This project follows **MVP/MVVM** architectural pattern with strict separation of concerns:

### Directory Structure

```
src/
├── view/           # Presentational components (React TSX)
├── viewmodel/      # Controllers/ViewModels (Business logic)
├── store/          # MobX stores (Global state)
├── services/       # API services (HTTP requests)
├── types/          # TypeScript interfaces and types
└── styles.css      # Global styles
```

### Architecture Principles

- **View Layer**: Pure presentational components without business logic
- **ViewModel/Controller**: Contains business logic, validation, and UI event handling
- **Store**: MobX-based reactive state management
- **Services**: API integration and data fetching
- **Types**: TypeScript interfaces for type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ and npm
- Modern browser with ES6 support

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd books-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in root directory
REACT_APP_API_BASE=https://localhost:3001/v1
REACT_APP_USER=your-username
```

### Development

Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### SSL Certificate Setup

⚠️ **Important**: The API uses self-signed SSL certificates. Before running the app:

1. Open [https://localhost:3001](https://localhost:3001) in your browser
2. Accept the security warning and allow the certificate
3. This enables the app to communicate with the API

## 🧪 Testing

This project uses **fast-test approach** focusing on logic over UI:

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test pattern
npm test -- --testNamePattern="BooksController"
```

### Test Coverage

- **Unit Tests**: Controllers, Stores, and Services
- **Component Tests**: Minimal "smoke" tests for React components
- **Mocked Network**: All API calls are mocked for fast, isolated tests
- **Coverage Target**: 80%+ for store/controller logic

### Test Structure

```
src/
├── BooksController.test.js    # ViewModel logic tests
├── BooksStore.test.js         # State management tests
├── Books.test.js              # Component integration tests
└── ...
```

## 📡 API Integration

### Endpoints

The app communicates with a RESTful API:

- `GET /v1/books/{user}/` - Fetch all user's books
- `GET /v1/books/{user}/private` - Fetch only user's private books
- `POST /v1/books/{user}/` - Create new book for user

### Configuration

API settings are configured via environment variables:

```typescript
// src/services/config.ts
export const API_BASE = process.env.REACT_APP_API_BASE || 'https://localhost:3001/v1';
export const USER = process.env.REACT_APP_USER || 'default-user';
```

### Error Handling

- Network timeouts and connection errors
- Server error responses (4xx, 5xx)
- Invalid JSON responses
- User-friendly error messages

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Building

```bash
# Build for production
npm run build
```

## 🏛️ MobX State Management

### Store Structure

```typescript
class BooksStore {
  books: Book[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  @action async loadBooks(): Promise<void>
  @action async addBook(name: string, author: string): Promise<void>
  
  get hasBooks(): boolean
  get booksCount(): number
}
```

### Controller Pattern

```typescript
class BooksController {
  @action setNewBookName(name: string): void
  @action setNewBookAuthor(author: string): void
  @action async handleAddBook(): Promise<boolean>
  
  get isFormValid(): boolean
  get canAddBook(): boolean
}
```

## 📝 Features

### Core Functionality

- ✅ **Load Books**: Fetch and display user's book collection
- ✅ **Add Books**: Create new books with name and author
- ✅ **Form Validation**: Real-time validation with user feedback
- ✅ **Loading States**: Visual feedback during API operations
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Empty States**: Helpful messages when no books exist

### UI/UX Features

- 📱 **Responsive Design**: Works on desktop and mobile
- ♿ **Accessibility**: Basic ARIA labels and keyboard navigation
- 🎨 **Loading Indicators**: Spinners and disabled states
- 🚫 **Double-click Protection**: Prevents duplicate submissions
- 🔄 **Auto-refresh**: Updates list after successful book creation

## 🛠️ Technical Stack

- **React 16.8+**: Component library with hooks
- **TypeScript**: Type safety and developer experience
- **MobX 6**: Reactive state management
- **React Testing Library**: Component testing
- **Jest**: Test runner and assertions
- **Prettier**: Code formatting
- **ESLint**: Code linting

## 🚀 Deployment

### GitHub Pages

This project is deployed to GitHub Pages from the `docs` folder.

- **Live Demo**: [https://pavmishchenko-oss.github.io/reaktivate-tdd-challenge](https://pavmishchenko-oss.github.io/reaktivate-tdd-challenge)
- **Deployment**: Manual copy of build to docs folder

### Build and Deploy

1. **Build the project:**
```bash
npm run build
```

2. **Copy build contents to docs folder:**
```bash
cp -r build/* docs/
```

3. **Commit and push changes:**
```bash
git add docs/
git commit -m "Update GitHub Pages"
git push origin main
```

### Environment Variables

Required environment variables for production:

```env
REACT_APP_API_BASE=https://your-api-domain.com/v1
REACT_APP_USER=production-user
```

## 🤝 Contributing

1. Follow the established architecture patterns
2. Write tests for new business logic
3. Use TypeScript for type safety
4. Format code with Prettier before committing
5. Ensure all tests pass

## 📄 License

This project is licensed under the MIT License.