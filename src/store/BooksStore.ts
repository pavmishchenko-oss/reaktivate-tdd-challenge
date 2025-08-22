import { makeAutoObservable, runInAction, action } from 'mobx';
import booksRepository from '../services/Books.repository';
import { Book } from '../types/Book';

export class BooksStore {
  books: Book[] = [];
  privateBooks: Book[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @action
  async loadBooks(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const [allBooks, privateBooks] = await Promise.all([
        booksRepository.getAllBooks(),
        booksRepository.getPrivateBooks()
      ]);
      
      runInAction(() => {
        this.books = allBooks;
        this.privateBooks = privateBooks;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load books. Please refresh the page.';
        this.isLoading = false;
      });
    }
  }

  @action
  async addBook(name: string, author: string): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const success = await booksRepository.addBook({ name, author });
      if (success) {
        await this.loadBooks(); // Reload the list
      } else {
        runInAction(() => {
          this.error = 'Failed to add book. Please try again.';
          this.isLoading = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error =
          'Failed to add book. Please check your internet connection.';
        this.isLoading = false;
      });
    }
  }

  get hasBooks(): boolean {
    return this.books.length > 0;
  }

  get booksCount(): number {
    return this.books.length;
  }

  get privateBooksCount(): number {
    return this.privateBooks.length;
  }
}

export default new BooksStore();
