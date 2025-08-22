import { makeAutoObservable, action } from 'mobx';
import booksStore from '../store/BooksStore';
import { Book } from '../types/Book';

export class BooksController {
  newBookName: string = '';
  newBookAuthor: string = '';
  isShowingAllBooks: boolean = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Input handling
  @action
  setNewBookName(name: string): void {
    this.newBookName = name;
  }

  @action
  setNewBookAuthor(author: string): void {
    this.newBookAuthor = author;
  }

  @action
  setShowAllBooks(showAll: boolean): void {
    this.isShowingAllBooks = showAll;
  }

  // Business logic
  @action
  async initialize(): Promise<void> {
    await booksStore.loadBooks();
  }

  @action
  async handleAddBook(): Promise<boolean> {
    if (!this.isFormValid) {
      return false;
    }

    await booksStore.addBook(this.newBookName, this.newBookAuthor);

    if (!booksStore.error) {
      this.clearForm();
      return true;
    }

    return false;
  }

  @action
  clearForm(): void {
    this.newBookName = '';
    this.newBookAuthor = '';
  }

  // Computed properties
  get isFormValid(): boolean {
    return this.newBookName.trim() !== '' && this.newBookAuthor.trim() !== '';
  }

  get canAddBook(): boolean {
    return this.isFormValid && !booksStore.isLoading;
  }

  get books(): Book[] {
    if (this.isShowingAllBooks) {
      return booksStore.books;
    } else {
      return booksStore.privateBooks;
    }
  }

  get isLoading(): boolean {
    return booksStore.isLoading;
  }

  get error(): string | null {
    return booksStore.error;
  }

  get hasBooks(): boolean {
    return this.books.length > 0;
  }

  get booksCount(): number {
    return this.books.length; // Return filtered books count as originally intended
  }

  get privateBooksCount(): number {
    return booksStore.privateBooksCount;
  }

  // Lifecycle management
  dispose(): void {
    // Clean up any subscriptions, timers, or resources
    // Currently no resources to dispose, but method is available for future use
  }
}

export default BooksController;
