import mongoose from "mongoose";
import { calcBookAvgRating } from "../utils/rating";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
      {
        userId: { type: String },
        grade: { type: Number },
      },
    ],
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

bookSchema.virtual("averageRating").get(function () {
  return calcBookAvgRating(this.ratings);
});

export const Book = mongoose.model("Book", bookSchema);
