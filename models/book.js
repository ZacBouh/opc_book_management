"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rating_1 = require("../utils/rating");
const bookSchema = new mongoose_1.default.Schema({
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
}, { toJSON: { virtuals: true } });
bookSchema.virtual("averageRating").get(function () {
    return (0, rating_1.calcBookAvgRating)(this.ratings);
});
exports.Book = mongoose_1.default.model("Book", bookSchema);
