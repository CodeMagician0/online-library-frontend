const API_BASE_URL = "http://localhost:8080/api";

export const BOOK_ROUTES = {
  getBooks: `${API_BASE_URL}/books`,
  getCategories: `${API_BASE_URL}/books/categories`,
  searchBook: `${API_BASE_URL}/books/search`,
};
