import { rest } from "msw";
import { MOCK_API_URL } from "./constants";
import mockBooks from "./mockBooks";
import BookModel from "../models/BookModel";

export const handlers = [
  rest.get(`${MOCK_API_URL}/api/books`, (req, res, ctx) => {
    const searchParams = new URLSearchParams(req.url.search);
    const size = searchParams.get("size");
    const page = searchParams.get("page");

    var books: Array<BookModel> = [];
    const rsp: { [key: string]: any } = {};
    if (size === null) {
      books = mockBooks(9);
    } else {
      if (page === "4") {
        books = mockBooks(2);
      } else {
        books = mockBooks(parseInt(size));
      }
      rsp.totalElements = 22;
      rsp.totalPages = 5;
    }
    rsp.content = books;

    return res(ctx.status(200), ctx.json(rsp));
  }),
];
