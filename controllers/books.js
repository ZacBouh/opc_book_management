"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const book_1 = require("../models/book");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getBooks(res) {
    try {
        book_1.Book.find().then((results) => {
            console.log("result of the book request ", results);
            res.status(200).json(results), res.status(500);
        }, (err) => {
            console.log("book find promise rejected ", err);
            res.status(500);
        });
    }
    catch (err) {
        console.log("error requesting the db", err);
        res.status(500);
    }
}
exports.getBooks = getBooks;
function getBook(req, res) {
    const bookId = req.params.bookId;
    console.log("book with id ", bookId, " requested");
    book_1.Book.findOne({ _id: bookId }).then((book) => {
        if (book == null)
            return res.status(204).json({ message: "no book found" });
        res.status(200).json(book);
    }, (err) => {
        res.status(500);
        console.log("book request promise rejected ", err);
    });
}
exports.getBook = getBook;
function createBook(req, res) {
    if (!req.body.book)
        return res.status(400).json("book information missing");
    if (!req.file)
        return res.status(400).json("image file missing");
    try {
        book_1.Book.create(Object.assign(Object.assign({}, JSON.parse(req.body.book)), { imageUrl: "http://" + req.get("host") + "/" + path_1.default.basename(req.file.path) })).then(() => res.status(201).json({ message: "book successfully created" }), (err) => {
            console.log("[ERROR] create book request promise rejected ", err);
            res.status(400).json(err);
        });
    }
    catch (err) {
        console.log("[ERROR] error requesting db for book creation ", err);
        res.status(500);
    }
}
exports.createBook = createBook;
function deleteBook(req, res) {
    const bookId = req.params.bookId;
    try {
        book_1.Book.findById(bookId).then((book) => {
            if (!book)
                return res
                    .status(200)
                    .json({ message: "no book found with this id" });
            const imagePath = process.env.PICTURES_FOLDER_PATH +
                "\\" +
                path_1.default.basename(book.imageUrl);
            book_1.Book.deleteOne({ _id: bookId }).then(() => {
                res.status(200).json({ message: "book deleted" });
                fs_1.default.unlink(imagePath, (err) => {
                    if (err)
                        return console.log("[ERROR] error deleting book image", err);
                    console.log("book successfully deleted");
                });
            }, (err) => {
                console.log("[ERROR] Book deletOne request promise rejected ", err);
                return res.status(500).json(err);
            });
        }, (err) => {
            console.log("book to be deleted find request promise rejected ", err);
            res.status(500).json(err);
        });
    }
    catch (err) {
        console.log("[ERROR] error deleting booki", err);
        res.status(500).json(err);
    }
}
exports.deleteBook = deleteBook;
