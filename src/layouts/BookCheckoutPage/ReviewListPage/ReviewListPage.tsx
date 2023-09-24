import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";
import { REVIEW_ROUTES } from "../../../services/Apis";
import useFetch from "../../Utils/useFetch";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Book to lookup reviews
  const bookId = window.location.pathname.split("/")[2];

  const fetcher = useFetch();

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${
        REVIEW_ROUTES.GET_BOOK_REVIEW
      }?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

      const { rsp, data } = await fetcher(reviewUrl);

      if (!rsp.ok) {
        throw new Error("Something went wrong");
      }

      const reviewsData = data.data;
      setTotalAmountOfReviews(reviewsData.totalElements);
      setTotalPages(reviewsData.totalPages);

      const loadedReviews: ReviewModel[] = [];

      const reviews = reviewsData.content;
      for (const key in reviews) {
        loadedReviews.push({
          id: reviews[key].id,
          username: reviews[key].user.username,
          date: reviews[key].date,
          rating: reviews[key].rating,
          book_id: reviews[key].bookId,
          reviewDescription: reviews[key].reviewDescription,
        });
      }

      setReviews(loadedReviews);
      setIsLoading(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

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

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
  let lastItem =
    reviewsPerPage * currentPage <= totalAmountOfReviews
      ? reviewsPerPage * currentPage
      : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <div>
        <h3>Comments: ({reviews.length})</h3>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews}{" "}
      </p>
      <div className="row">
        {reviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
