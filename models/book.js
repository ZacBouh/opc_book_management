"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    title: { type: String, reaquired: true }, author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
            userId: { type: String },
            grade: { type: Number }
        }],
    imageUrl: { type: String, required: true }, userId: { type: String, required: true }
});
module.exports = mongoose_1.default.model('Book', bookSchema);
