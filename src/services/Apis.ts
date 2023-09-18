const API_BASE_URL = "http://localhost:8080/api";

export const BOOK_ROUTES = {
  getBooks: `${API_BASE_URL}/books`,
  getCategories: `${API_BASE_URL}/books/categories`,
  searchBook: `${API_BASE_URL}/books/search`,
  checkout: `${API_BASE_URL}/books/secure/checkout`,
  getBookInfo: `${API_BASE_URL}/books/info`,
};

export const AUTH_ROUTES = {
  login: `${API_BASE_URL}/auth/signin`,
  register: `${API_BASE_URL}/auth/signup`,
};

export const USER_ROUTES = {
  refreshUser: `${API_BASE_URL}/users/secure/refresh`,
};

export const REVIEW_ROUTES = {
  getReview: `${API_BASE_URL}/reviews`,
};
