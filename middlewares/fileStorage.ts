import multer from "multer";
import { AuthorizedRequest } from "./auth";
import { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, process.env.PICTURES_FOLDER_PATH as string);
  },
  filename: (req, file, cb) => {
    const userId = ((req as AuthorizedRequest).userId as JwtPayload).userId;

    const uniquePrefix = Date.now() + "_" + userId + "_";
    cb(null, uniquePrefix + file.originalname);
  },
});

export const uploadBookImage = multer({ storage }).single("image");
