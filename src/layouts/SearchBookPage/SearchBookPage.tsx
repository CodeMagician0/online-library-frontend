import { useEffect, useState } from "react";
import BookModel, { createBook } from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBookPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttopError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "http://localhost:8080/api/books";
      let url: string = "";

      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        url = baseUrl + searchUrl;
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
      setHttopError(error.message);
    });
    // window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

  if (isLoading) {
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
    if (search === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${search}&page=0&size=${booksPerPage}`
      );
    }
  };

  const currLastIdx: number = currentPage * booksPerPage;
  const indexOfLastBook: number =
    totalAmountOfBooks >= currLastIdx ? currLastIdx : totalAmountOfBooks;
  const indexOfFirstBook: number =
    (totalAmountOfBooks >= currLastIdx
      ? indexOfLastBook - booksPerPage
      : totalAmountOfBooks - (totalAmountOfBooks % booksPerPage)) + 1;
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-6">
            <div className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-labelledby="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-outline-success"
                onClick={() => searchHandleChange()}
              >
                Search
              </button>
            </div>
          </div>
          <div className="col-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expaneded="false"
              >
                Category
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    All
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Frontend
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Backend
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Data
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    DevOps
                  </a>
                </li>
              </ul>
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
  );
};
