export interface Book {
  id?: string;
  name: string;
  author: string;
}

export interface BookCreateRequest {
  name: string;
  author: string;
}

export interface BookCreateResponse {
  status: 'ok' | 'error';
  message?: string;
  data?: Book;
}

export interface BooksListResponse {
  books: Book[];
  total: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
