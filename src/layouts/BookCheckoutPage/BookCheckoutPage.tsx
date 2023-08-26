import { useState, useEffect } from "react";
import BookModel from "../../models/BookModel";
import { BOOK_ROUTES } from "../../services/apis";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const bookId = window.location.pathname.split("/")[2];

  // triggered after the first time render, and everytime the passed-in state changes.
  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `${BOOK_ROUTES.getBooks}/${bookId}`;
      const rsp = await fetch(baseUrl);
      if (!rsp.ok) {
        throw new Error("Something went wrong!");
      }
      const rspJson = await rsp.json();

      const rspData = rspJson.content;

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
      <h3>Hello World!</h3>
    </div>
  );
};
