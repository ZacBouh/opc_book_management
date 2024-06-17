import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export type authorizedRequest = Request & {
  userId?: string | jwt.JwtPayload | undefined;
};

export function generateAccessToken(userId: String) {
  return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET as jwt.Secret, {
    expiresIn: "1h",
  });
}

export function authenticateToken(
  req: authorizedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (token == null) {
    console.log("\\x1b[31m" + "[ERROR]" + "\\x1b[0m" + "auth failed ");
    return res.status(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret, (err, userId) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("token expired redirecting");
        res.redirect(401, "/Connexion");
      }
      console.log("[ERROR] auth middleware error ", err);
      return res.status(401).json(err);
    }
    req.userId = userId;
    next();
  });
}
