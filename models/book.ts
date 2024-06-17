import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
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
});

export const Book = mongoose.model("Book", bookSchema);
