import { useState, useEffect } from "react";
import BookModel from "../../models/BookModel";
import { BOOK_ROUTES } from "../../services/apis";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const bookId = window.location.pathname.split("/")[2];
  console.log(`bookId: ${bookId}`);
  // triggered after the first time render, and everytime the passed-in state changes.
  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `${BOOK_ROUTES.getBookById}?bookId=${bookId}`;
      console.log(`baseUrl: ${baseUrl}`);
      const rsp = await fetch(baseUrl);
      if (!rsp.ok) {
        throw new Error("Something went wrong!");
      }
      const rspData = await rsp.json();

      const loadedBook: BookModel = {
        id: rspData.id,
        title: rspData.title,
        author: rspData.author,
        description: rspData.description,
        copies: rspData.copies,
        copiesAvailable: rspData.copiesAvailable,
        category: rspData.category,
        img: rspData.img,
      };

      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

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

  return (
    <div>
      {/* big screen */}
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={-5} size={32}/>
            </div>
          </div>
        </div>
        <hr />
      </div>
      {/* mobile */}
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center alighn-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={-5} size={32}/>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};
