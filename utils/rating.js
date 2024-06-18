"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcBookAvgRating = void 0;
function calcBookAvgRating(ratings) {
    if (ratings.length === 0)
        return 0;
    const reviewsCount = ratings.length;
    const reviewsRatingsSum = ratings
        .map((review) => review.grade)
        .reduce((sum, rating) => (sum !== null && sum !== void 0 ? sum : 0) + (rating !== null && rating !== void 0 ? rating : 0));
    return reviewsRatingsSum ? reviewsRatingsSum / reviewsCount : 0;
}
exports.calcBookAvgRating = calcBookAvgRating;
