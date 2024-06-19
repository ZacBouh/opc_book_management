import { Request, Response } from "express";
import { Book } from "../models/book";
import { getImagePath, getImageUrl } from "../utils/imageStorage";
import path from "path";
import fs from "fs";
import { AuthorizedRequest } from "../middlewares/auth";

export function getBooks(res: Response) {
  try {
    Book.find().then(
      (results) => {
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

  if (bookId === "bestrating") {
    console.log("[INFO] request for 3 best books");
    try {
      Book.find()
        .sort({ averageRating: 1 })
        .limit(3)
        .then(
          (book) => {
            res.status(200).json(book);
            return console.log("3 best rated books ", book.length);
          },
          (err) => {
            console.log("[ERROR] could not retrieve 3 best books ", err);
            return res.status(400).json(err);
          }
        );
      return;
    } catch (err) {
      console.log("[ERROR] could not treat bestrating request ", err);
      return res.status(500).json();
    }
  }

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
      // ratings: [],
      imageUrl: getImageUrl(req),
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

export function deleteBook(req: AuthorizedRequest, res: Response) {
  const bookId = req.params.bookId;

  try {
    Book.findById(bookId).then(
      (book) => {
        if (!book)
          return res
            .status(200)
            .json({ message: "no book found with this id" });

        const imagePath = getImagePath(book.imageUrl);

        Book.deleteOne({ _id: bookId, userId: req.userId?.userId }).then(
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

export function updateBook(req: AuthorizedRequest, res: Response) {
  const bookId = req.params.bookId;
  let updateContent: any;

  try {
    if (req.body.title) {
      updateContent = req.body;
    } else {
      updateContent = {
        ...JSON.parse(req.body.book),
        imageUrl: getImageUrl(req),
      };
    }
    console.log("[UPDATE] update content is ", updateContent);
    Book.findOneAndUpdate(
      { _id: bookId, userId: req.userId?.userId },
      updateContent
    ).then(
      (previousDocument) => {
        if (previousDocument === null)
          throw new Error(
            `DB did not aknowledge document update for book ${bookId}`
          );
        console.log(
          `successfully updated book ${bookId} with content `,
          updateContent
        );
        res
          .status(201)
          .json({ message: "successfully updated book with content " });
        if (req.body.book) {
          fs.unlink(getImagePath(previousDocument.imageUrl), (err) => {
            if (err)
              console.log(`[ERROR] could not remove previous image 
                ${getImagePath(previousDocument.imageUrl)}              
              `);
          });
        }
      },
      (err) => {
        throw new Error(err);
      }
    );
  } catch (err) {
    console.log(`[ERROR] could not update book ${bookId} `, err);
    res.status(500).json(err);
  }
}

export function rateBook(req: AuthorizedRequest, res: Response) {
  const bookId = req.params.bookId;

  try {
    Book.findById(bookId).then(
      (book) => {
        if (!book) {
          res.status(400).json("no book found with this Id");
          console.log("[ERROR no book found with this Id");
          return;
        }

        Book.findOneAndUpdate(
          { _id: bookId },
          {
            ratings: [...book.ratings, { ...req.body, grade: req.body.rating }],
          },
          { new: true }
        ).then(
          (updatedBook) => {
            if (!updatedBook)
              throw new Error("server did not aknowledge the update operation");
            console.log(
              `[UPDATE] successfully added rating to book ${bookId} `,
              req.body
            );
            res.status(201).json(updatedBook);
          },
          (err) => {
            console.log(`[ERROR] could not update rating `, err);
          }
        );
      },
      (err) => {
        throw new Error(err);
      }
    );
  } catch (err) {
    console.log(`[ERROR] could not update book rating `, err);
    res.status(500).json(err);
  }
}
