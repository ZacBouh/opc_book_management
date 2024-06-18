import { Request } from "express";
import path from "path";
import "dotenv/config";

export function getImageUrl(req: Request) {
  if (!req.file) throw new Error("getImageUrl error : req.file doesnt exist");
  return "http://" + req.get("host") + "/" + path.basename(req.file.path);
}

export function getImagePath(imageUrl: string) {
  return (
    (process.env.PICTURES_FOLDER_PATH as string) +
    "\\" +
    path.basename(imageUrl)
  );
}
