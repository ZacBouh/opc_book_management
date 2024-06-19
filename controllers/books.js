"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateBook = exports.updateBook = exports.deleteBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const book_1 = require("../models/book");
const imageStorage_1 = require("../utils/imageStorage");
const fs_1 = __importDefault(require("fs"));
function getBooks(res) {
    try {
        book_1.Book.find().then((results) => {
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
    if (bookId === "bestrating") {
        console.log("[INFO] request for 3 best books");
        try {
            book_1.Book.find()
                .sort({ averageRating: 1 })
                .limit(3)
                .then((book) => {
                res.status(200).json(book);
                return console.log("3 best rated books ", book.length);
            }, (err) => {
                console.log("[ERROR] could not retrieve 3 best books ", err);
                return res.status(400).json(err);
            });
            return;
        }
        catch (err) {
            console.log("[ERROR] could not treat bestrating request ", err);
            return res.status(500).json();
        }
    }
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
        book_1.Book.create(Object.assign(Object.assign({}, JSON.parse(req.body.book)), { 
            // ratings: [],
            imageUrl: (0, imageStorage_1.getImageUrl)(req) })).then(() => res.status(201).json({ message: "book successfully created" }), (err) => {
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
            var _a;
            if (!book)
                return res
                    .status(200)
                    .json({ message: "no book found with this id" });
            const imagePath = (0, imageStorage_1.getImagePath)(book.imageUrl);
            book_1.Book.deleteOne({ _id: bookId, userId: (_a = req.userId) === null || _a === void 0 ? void 0 : _a.userId }).then(() => {
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
function updateBook(req, res) {
    var _a;
    const bookId = req.params.bookId;
    let updateContent;
    try {
        if (req.body.title) {
            updateContent = req.body;
        }
        else {
            updateContent = Object.assign(Object.assign({}, JSON.parse(req.body.book)), { imageUrl: (0, imageStorage_1.getImageUrl)(req) });
        }
        console.log("[UPDATE] update content is ", updateContent);
        book_1.Book.findOneAndUpdate({ _id: bookId, userId: (_a = req.userId) === null || _a === void 0 ? void 0 : _a.userId }, updateContent).then((previousDocument) => {
            if (previousDocument === null)
                throw new Error(`DB did not aknowledge document update for book ${bookId}`);
            console.log(`successfully updated book ${bookId} with content `, updateContent);
            res
                .status(201)
                .json({ message: "successfully updated book with content " });
            if (req.body.book) {
                fs_1.default.unlink((0, imageStorage_1.getImagePath)(previousDocument.imageUrl), (err) => {
                    if (err)
                        console.log(`[ERROR] could not remove previous image 
                ${(0, imageStorage_1.getImagePath)(previousDocument.imageUrl)}              
              `);
                });
            }
        }, (err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        console.log(`[ERROR] could not update book ${bookId} `, err);
        res.status(500).json(err);
    }
}
exports.updateBook = updateBook;
function rateBook(req, res) {
    const bookId = req.params.bookId;
    try {
        book_1.Book.findById(bookId).then((book) => {
            if (!book) {
                res.status(400).json("no book found with this Id");
                console.log("[ERROR no book found with this Id");
                return;
            }
            book_1.Book.findOneAndUpdate({ _id: bookId }, {
                ratings: [...book.ratings, Object.assign(Object.assign({}, req.body), { grade: req.body.rating })],
            }, { new: true }).then((updatedBook) => {
                if (!updatedBook)
                    throw new Error("server did not aknowledge the update operation");
                console.log(`[UPDATE] successfully added rating to book ${bookId} `, req.body);
                res.status(201).json(updatedBook);
            }, (err) => {
                console.log(`[ERROR] could not update rating `, err);
            });
        }, (err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        console.log(`[ERROR] could not update book rating `, err);
        res.status(500).json(err);
    }
}
exports.rateBook = rateBook;
