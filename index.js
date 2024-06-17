"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./controllers/user");
const books_1 = require("./controllers/books");
const auth_1 = require("./middlewares/auth");
const multer_1 = require("./middlewares/multer");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 4000;
mongoose_1.default
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_ADDRESS}`)
    .then(() => console.log("successfull connection to db test"))
    .catch((er) => console.log("error connecting to db", er));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json());
// app.use(express.urlencoded({extended : true}))
app.get("/", (req, res) => {
    res.send("Hello it works");
});
/* STATIC FILES */
app.use(express_1.default.static(process.env.PICTURES_FOLDER_PATH));
/* BOOKS ROUTES */
app.get("/api/books", (req, res) => (0, books_1.getBooks)(res));
app.get("/api/books/:bookId", books_1.getBook);
app.delete("/api/books/:bookId", books_1.deleteBook);
app.post("/api/books", auth_1.authenticateToken, multer_1.uploadBookImage, books_1.createBook);
/* AUTH ROUTES */
app.post("/api/auth/signup", (req, res) => {
    var _a, _b;
    console.log(`sign up request received with ${(_a = req.body) === null || _a === void 0 ? void 0 : _a.email} and ${(_b = req.body) === null || _b === void 0 ? void 0 : _b.password}`);
    (0, user_1.createUser)(req.body.email, req.body.password, res);
});
app.post("/api/auth/login", (req, res) => {
    var _a, _b, _c, _d;
    console.log(`login request received with ${(_a = req.body) === null || _a === void 0 ? void 0 : _a.email} and ${(_b = req.body) === null || _b === void 0 ? void 0 : _b.password}`);
    (0, user_1.loginUser)((_c = req.body) === null || _c === void 0 ? void 0 : _c.email, (_d = req.body) === null || _d === void 0 ? void 0 : _d.password, res);
});
// app.get("/api/auth/users", (req, res) => {
//   console.log("request for users");
//   const getRequest = getUsers();
//   getRequest
//     .then((users) => res.status(201).json(users))
//     .catch((error) => res.status(400).json(error));
// });
app.listen(port, () => console.log(`listening on port ${port}
`));
