import UserModel from "./UserModel";

class ReviewModel {
    id: number;
    userInfo: UserModel;
    date: string;
    rating: number;
    bookId: number;
    reviewDescription?: string;

    constructor(id: number, userInfo: UserModel, date: string, rating: number, bookId: number, reviewDescription: string) {
        this.id = id;
        this.userInfo = userInfo;
        this.date = date;
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewModel;