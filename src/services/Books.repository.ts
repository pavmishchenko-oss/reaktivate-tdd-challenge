import ApiGateway from './ApiGateway';
import { USER } from './config';
import { Book, BookCreateRequest, BookCreateResponse } from '../types/Book';

class BooksRepository {
  private httpGateway: ApiGateway;

  constructor() {
    this.httpGateway = new ApiGateway();
  }

  getAllBooks = async (): Promise<Book[]> => {
    const booksDto = await this.httpGateway.get(`/books/${USER}/`);
    return booksDto as Book[];
  };

  getPrivateBooks = async (): Promise<Book[]> => {
    const booksDto = await this.httpGateway.get(`/books/${USER}/private`);
    return booksDto as Book[];
  };

  addBook = async ({ name, author }: BookCreateRequest): Promise<boolean> => {
    const bookAddDto = await this.httpGateway.post(
      `/books/${USER}/`,
      { name, author }
    ) as BookCreateResponse;
    return bookAddDto && bookAddDto.status === 'ok' ? true : false;
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
