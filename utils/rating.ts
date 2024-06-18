import mongoose from "mongoose";

export function calcBookAvgRating(
  ratings: mongoose.Types.DocumentArray<{
    userId?: string | null | undefined;
    grade?: number | null | undefined;
  }>
) {
  if (ratings.length === 0) return 0;
  const reviewsCount = ratings.length;
  const reviewsRatingsSum = ratings
    .map((review) => review.grade)
    .reduce((sum, rating) => (sum ?? 0) + (rating ?? 0));

  return reviewsRatingsSum ? reviewsRatingsSum / reviewsCount : 0;
}
