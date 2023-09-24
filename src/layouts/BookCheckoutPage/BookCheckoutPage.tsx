import { useState, useEffect, useContext } from "react";
import BookModel from "../../models/BookModel";
import { BOOK_ROUTES, REVIEW_ROUTES } from "../../services/Apis";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import AuthContext from "../../context/AuthContext";
import ReviewModel from "../../models/ReviewModel";
import useFetch from "../Utils/useFetch";
import { LatestReviews } from "./LatestReviews";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  // Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

  // Book Checkout State
  const [isCheckedout, setIsCheckedout] = useState(false);
  const [isLoadingBookCheckedout, setIsLoadingBookCheckedout] = useState(true);

  const fetcher = useFetch();

  const bookId = window.location.pathname.split("/")[2];
  console.log(`bookId: ${bookId}`);
  // triggered after the first time render, and everytime the passed-in state changes.

  // get book info
  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `${BOOK_ROUTES.GET_BOOK_INFO}?bookId=${bookId}`;
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
  }, [isCheckedout]);

  // get book review
  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${REVIEW_ROUTES.GET_BOOK_REVIEW}?bookId=${bookId}`;

      const { rsp, data } = await fetcher(reviewUrl, {});
      if (!rsp.ok) {
        throw new Error("Something went wrong!");
      }

      const rspData = data.data;

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      const reviews = rspData.content;
      for (const key in reviews) {
        loadedReviews.push({
          id: reviews[key].id,
          username: reviews[key].user.username,
          date: reviews[key].date,
          rating: reviews[key].rating,
          book_id: reviews[key].bookId,
          reviewDescription: reviews[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + reviews[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  // user current loans count
  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (isAuthenticated) {
        const url = `${BOOK_ROUTES.GET_LOANS_COUNT}`;
        const config = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { rsp, data } = await fetcher(url, config);
        if (!rsp.ok) {
          throw new Error("Something went wrong!");
        }
        const loansCount = data.data;
        setCurrentLoansCount(loansCount);
      }

      setIsLoadingCurrentLoansCount(false);
    };

    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [isAuthenticated, isCheckedout]);

  // get book checkout state by user
  useEffect(() => {
    const fetchUserCheckedoutBook = async () => {
      if (isAuthenticated) {
        const url = `${BOOK_ROUTES.IS_CHECKOUT_BY_USER}?bookId=${bookId}`;
        const config = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { rsp, data } = await fetcher(url, config);

        if (!rsp.ok) {
          throw new Error("Something went wrong!");
        }

        setIsCheckedout(data.data);
      }

      setIsLoadingBookCheckedout(false);
    };

    fetchUserCheckedoutBook().catch((error: any) => {
      setIsLoadingBookCheckedout(false);
      setHttpError(error.message);
    });
  }, [isAuthenticated]);

  // check whether user had comment
  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (isAuthenticated) {
        const url = `${REVIEW_ROUTES.CHECK_USER_REVIEW}?bookId=${bookId}`;
        const config = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { rsp, data } = await fetcher(url, config);
        if (!rsp.ok) {
          throw new Error("Something went wrong");
        }

        setIsReviewLeft(data.data);
      }
      setIsLoadingUserReview(false);
    };

    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [isAuthenticated]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedout ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkoutBook() {
    const url = `${BOOK_ROUTES.CHECKOUT}?bookId=${book?.id}`;
    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { rsp } = await fetcher(url, config);
    if (!rsp.ok) {
      throw new Error("Something went wrong");
    }
    setIsCheckedout(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }
    const reviewReq = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );
    const url = `${REVIEW_ROUTES.LEAVE_REVIEW}`;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewReq),
    };
    const { rsp } = await fetcher(url, config);
    if (!rsp.ok) {
      throw new Error("Something went wrong");
    }
    setIsReviewLeft(true);
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
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthenticated={isAuthenticated}
            isCheckedout={isCheckedout}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
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
            <StarsReview rating={-5} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={isAuthenticated}
          isCheckedout={isCheckedout}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
