import { useEffect, useState } from "react";
import BookModel, { createBook } from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";
import { BOOK_ROUTES } from "../../services/Apis";

export const SearchBookPage = () => {
  const ALL_CATEGORIES = "All Categories";
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [currCategory, setCurrCategory] = useState(ALL_CATEGORIES);
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const url: string = BOOK_ROUTES.getCategories;
      const rsp = await fetch(url);
      if (!rsp.ok) {
        throw new Error("Something went wrong!");
      }

      const rspJson = await rsp.json();
      const rspData = rspJson.categories;

      setCategories(rspData);
      setIsCategoryLoading(false);
    };

    fetchCategories().catch((error: any) => {
      setIsCategoryLoading(false);
      setHttpError(error.message);
    });
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = BOOK_ROUTES.getBooks;
      let url: string = "";

      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace(
          "<pageNumber>",
          `${currentPage - 1}`
        );
        url = searchWithPage;
      }

      const rsp = await fetch(url);
      if (!rsp.ok) {
        throw new Error("Something went wrong!");
      }
      const rspJson = await rsp.json();

      const rspData = rspJson.content;

      setTotalAmountOfBooks(rspJson.totalElements);
      setTotalPages(rspJson.totalPages);

      const loadedBooks: BookModel[] = [];

      for (const key in rspData) {
        loadedBooks.push(
          createBook(
            rspData[key].id,
            rspData[key].title,
            rspData[key].author,
            rspData[key].description,
            rspData[key].copies,
            rspData[key].copiesAvailable,
            rspData[key].category,
            rspData[key].img
          )
        );
      }

      setBooks(loadedBooks);
      setIsLoading(false);
    };

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

  if (isLoading || isCategoryLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const searchHandleChange = () => {
    setCurrentPage(1);

    const baseUrl: string = BOOK_ROUTES.searchBook;
    let url: string = baseUrl + `?&page=<pageNumber>&size=${booksPerPage}`;

    if (search !== "") {
      url += `&title=${search}`;
    }

    if (currCategory !== ALL_CATEGORIES) {
      url += `&category=${currCategory}`;
    }

    setSearchUrl(url);
  };

  const categoryField = (value: string) => {
    setCurrCategory(value);
  };

  const currLastIdx: number = currentPage * booksPerPage;
  const indexOfLastBook: number =
    totalAmountOfBooks >= currLastIdx ? currLastIdx : totalAmountOfBooks;
  const indexOfFirstBook: number =
    (totalAmountOfBooks >= currLastIdx
      ? indexOfLastBook - booksPerPage
      : totalAmountOfBooks - (totalAmountOfBooks % booksPerPage)) + 1;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-10">
            <div className="input-group mb-3">
              <div className="input-group-prepend" style={{ width: "15%" }}>
                <button
                  className="btn custom-dropdown-bg square-btn  dropdown-toggle w-100"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {currCategory}
                </button>
                <ul className="dropdown-menu">
                  <li onClick={() => categoryField(ALL_CATEGORIES)}>
                    <a className="dropdown-item" href="#">
                      All Categories
                    </a>
                  </li>
                  {categories.map((category) => (
                    <li onClick={() => categoryField(category)} key={category}>
                      <a className="dropdown-item" href="#">
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <input
                className="form-control"
                type="search"
                placeholder="Search for title"
                aria-labelledby="Search"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchHandleChange();
                  }
                }}
              />
              <div className="input-group-append" style={{ width: "20%" }}>
                <button
                  className="btn custom-search-bg square-btn btn-secondary w-100"
                  type="button"
                  onClick={() => searchHandleChange()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {totalAmountOfBooks > 0 ? (
            <>
              <div className="mt-3">
                <h5>Number of results: ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {indexOfFirstBook} to {indexOfLastBook} of {totalAmountOfBooks}{" "}
                items:
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className="m-5">
              <h3>Can't find what you are looking for?</h3>
              <a
                type="button"
                className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                href="#"
              >
                Library Services
              </a>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
