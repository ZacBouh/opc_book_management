"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./controllers/user");
const books_1 = require("./controllers/books");
const auth_1 = require("./middlewares/auth");
const fileStorage_1 = require("./middlewares/fileStorage");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./controllers/db"));
const app = (0, express_1.default)();
const port = 4000;
(0, db_1.default)();
app.listen(port, () => console.log(`listening on port ${port}
`));
/* GLOBAL MIDDLEWARES */
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_SERVER_HOST,
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json());
/* ROUTING */
app.get("/", (req, res) => {
    res.send("Hello, Backend Up!");
});
/* STATIC FILES */
app.use(express_1.default.static(process.env.PICTURES_FOLDER_PATH));
/* BOOKS ROUTES */
app.get("/api/books", (_, res) => (0, books_1.getBooks)(res));
app.get("/api/books/:bookId", books_1.getBook);
app.delete("/api/books/:bookId", auth_1.authenticateToken, books_1.deleteBook);
app.post("/api/books", auth_1.authenticateToken, fileStorage_1.uploadBookImage, fileStorage_1.compressImage, books_1.createBook);
app.put("/api/books/:bookId", auth_1.authenticateToken, fileStorage_1.uploadBookImage, fileStorage_1.compressImage, books_1.updateBook);
app.post("/api/books/:bookId/rating", auth_1.authenticateToken, books_1.rateBook);
/* AUTH ROUTES */
app.post("/api/auth/signup", (req, res) => {
    (0, user_1.createUser)(req.body.email, req.body.password, res);
});
app.post("/api/auth/login", (req, res) => {
    var _a, _b;
    (0, user_1.loginUser)((_a = req.body) === null || _a === void 0 ? void 0 : _a.email, (_b = req.body) === null || _b === void 0 ? void 0 : _b.password, res);
});
