const API_BASE_URL = "http://localhost:8080/api";

export const BOOK_ROUTES = {
  GET_BOOKS: `${API_BASE_URL}/books`,
  GET_CATEGORIES: `${API_BASE_URL}/books/categories`,
  SEARCH_BOOK: `${API_BASE_URL}/books/search`,
  CHECKOUT: `${API_BASE_URL}/books/secure/checkout`,
  IS_CHECKOUT_BY_USER: `${API_BASE_URL}/books/secure/ischeckout/byuser`,
  GET_BOOK_INFO: `${API_BASE_URL}/books/info`,
  GET_LOANS_COUNT: `${API_BASE_URL}/books/secure/loans/count`,
};

export const REVIEW_ROUTES = {
  GET_BOOK_REVIEW: `${API_BASE_URL}/reviews`,
  CHECK_USER_REVIEW: `${API_BASE_URL}/reviews/secure/iscomment/byuser`,
  LEAVE_REVIEW: `${API_BASE_URL}/reviews/secure/comment`,
};

export const AUTH_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/signin`,
  REGISTER: `${API_BASE_URL}/auth/signup`,
};

export const USER_ROUTES = {
  REFRESH_USER: `${API_BASE_URL}/users/secure/refresh`,
};
