import express from "express";
import { createUser, loginUser } from "./controllers/user";
import {
  getBook,
  getBooks,
  createBook,
  deleteBook,
  updateBook,
  rateBook,
} from "./controllers/books";
import { authenticateToken } from "./middlewares/auth";
import { uploadBookImage, compressImage } from "./middlewares/fileStorage";
import "dotenv/config";
import cors from "cors";
import dbConnect from "./controllers/db";

const app = express();
const port = 4000;

dbConnect();

app.listen(port, () =>
  console.log(`listening on port ${port}
`)
);

/* GLOBAL MIDDLEWARES */

app.use(
  cors({
    origin: process.env.CLIENT_SERVER_HOST,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

/* ROUTING */

app.get("/", (req, res) => {
  res.send("Hello, Backend Up!");
});

/* STATIC FILES */

app.use(express.static(process.env.PICTURES_FOLDER_PATH as string));

/* BOOKS ROUTES */

app.get("/api/books", (_, res) => getBooks(res));

app.get("/api/books/:bookId", getBook);

app.delete("/api/books/:bookId", authenticateToken, deleteBook);

app.post(
  "/api/books",
  authenticateToken,
  uploadBookImage,
  compressImage,
  createBook
);

app.put(
  "/api/books/:bookId",
  authenticateToken,
  uploadBookImage,
  compressImage,
  updateBook
);

app.post("/api/books/:bookId/rating", authenticateToken, rateBook);

/* AUTH ROUTES */

app.post("/api/auth/signup", (req, res) => {
  createUser(req.body.email, req.body.password, res);
});

app.post("/api/auth/login", (req, res) => {
  loginUser(req.body?.email, req.body?.password, res);
});
