import fs from "fs";
import path from "path";
import sharp from "sharp";
import multer from "multer";
import { Response, NextFunction } from "express";
import { AuthorizedRequest } from "./auth";
import { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, process.env.PICTURES_FOLDER_PATH as string);
  },
  filename: (req, file, cb) => {
    const userId = ((req as AuthorizedRequest).userId as JwtPayload).userId;

    const uniquePrefix =
      Date.now() + "_" + userId + "_" + Math.floor(Math.random() * 10000);
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

export const uploadBookImage = multer({ storage }).single("image");

export function compressImage(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.file) {
    console.log("[WARNING] compressImage middleware : no image to compress");
    return next();
  }

  const compressedImagePath =
    path.dirname(req.file.path) +
    "/" +
    path.basename(req.file.path).replace(path.extname(req.file.path), ".webp");

  try {
    sharp.cache(false);
    sharp(req.file.path)
      .webp({ nearLossless: true })
      .toFile(compressedImagePath, (err, info) => {
        if (err) {
          console.log("[ERROR] failed to compress image ", err);
          res.status(500).json(err);
          return;
        }
        console.log(
          "[INFO] compressImage middleware : successfully compressed image ",
          path.basename(compressedImagePath)
        );

        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err)
              return console.log(
                "[ERROR] compressImage middleware : could not remove original image ",
                err
              );
          });

          req.file.path = compressedImagePath;
        }
        next();
      });
  } catch (err) {
    console.log(
      "[ERROR] compressImage middleware : failed to compress image ",
      err
    );
    res.status(500).json(err);
    return;
  }
}
