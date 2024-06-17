import { Request, Response } from "express";
import { Book } from "../models/book";
import path from "path";
import fs from "fs";

export function getBooks(res: Response) {
  try {
    Book.find().then(
      (results) => {
        console.log("result of the book request ", results);
        res.status(200).json(results), res.status(500);
      },
      (err) => {
        console.log("book find promise rejected ", err);
        res.status(500);
      }
    );
  } catch (err) {
    console.log("error requesting the db", err);
    res.status(500);
  }
}

export function getBook(req: Request, res: Response) {
  const bookId = req.params.bookId;

  console.log("book with id ", bookId, " requested");

  Book.findOne({ _id: bookId }).then(
    (book) => {
      if (book == null)
        return res.status(204).json({ message: "no book found" });
      res.status(200).json(book);
    },
    (err) => {
      res.status(500);
      console.log("book request promise rejected ", err);
    }
  );
}

export function createBook(req: Request, res: Response) {
  if (!req.body.book) return res.status(400).json("book information missing");
  if (!req.file) return res.status(400).json("image file missing");
  try {
    Book.create({
      ...JSON.parse(req.body.book),
      imageUrl:
        "http://" + req.get("host") + "/" + path.basename(req.file.path),
    }).then(
      () => res.status(201).json({ message: "book successfully created" }),
      (err) => {
        console.log("[ERROR] create book request promise rejected ", err);
        res.status(400).json(err);
      }
    );
  } catch (err) {
    console.log("[ERROR] error requesting db for book creation ", err);
    res.status(500);
  }
}

export function deleteBook(req: Request, res: Response) {
  const bookId = req.params.bookId;

  try {
    Book.findById(bookId).then(
      (book) => {
        if (!book)
          return res
            .status(200)
            .json({ message: "no book found with this id" });

        const imagePath =
          (process.env.PICTURES_FOLDER_PATH as string) +
          "\\" +
          path.basename(book.imageUrl);

        Book.deleteOne({ _id: bookId }).then(
          () => {
            res.status(200).json({ message: "book deleted" });
            fs.unlink(imagePath, (err) => {
              if (err)
                return console.log("[ERROR] error deleting book image", err);
              console.log("book successfully deleted");
            });
          },
          (err) => {
            console.log("[ERROR] Book deletOne request promise rejected ", err);
            return res.status(500).json(err);
          }
        );
      },
      (err) => {
        console.log("book to be deleted find request promise rejected ", err);
        res.status(500).json(err);
      }
    );
  } catch (err) {
    console.log("[ERROR] error deleting booki", err);
    res.status(500).json(err);
  }
}
