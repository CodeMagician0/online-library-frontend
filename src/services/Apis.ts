const API_BASE_URL = "http://localhost:8080/api";

export const BOOK_ROUTES = {
  GET_BOOKS: `${API_BASE_URL}/books`,
  GET_CATEGORIES: `${API_BASE_URL}/books/categories`,
  SEARCH_BOOK: `${API_BASE_URL}/books/search`,
  CHECKOUT: `${API_BASE_URL}/books/secure/checkout`,
  GET_BOOK_INFO: `${API_BASE_URL}/books/info`,
};

export const AUTH_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/signin`,
  REGISTER: `${API_BASE_URL}/auth/signup`,
};

export const USER_ROUTES = {
  REFRESH_USER: `${API_BASE_URL}/users/secure/refresh`,
};
