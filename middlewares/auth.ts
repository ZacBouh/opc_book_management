import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export type AuthorizedRequest = Request & {
  userId?: jwt.JwtPayload;
};

export function generateAccessToken(userId: String) {
  return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET as jwt.Secret, {
    expiresIn: "1h",
  });
}

export function authenticateToken(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  console.log("[AUTH] request received");
  const authHeader = req.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (token == null) {
    console.log("\\x1b[31m" + "[ERROR]" + "\\x1b[0m" + "auth failed ");
    return res.status(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret, (err, userId) => {
    if (err) {
      const redirectUrl = process.env.CLIENT_SERVER_HOST + "/Connexion";
      if (err.name === "TokenExpiredError") {
        console.log("[AUTH] token expired redirecting to ", redirectUrl);
        res.redirect(401, redirectUrl);
        return;
      }
      console.log("[ERROR] auth middleware error ", err.name);
      console.log("redirecting to ", redirectUrl);
      return res.redirect(401, redirectUrl);
    }
    if (!(typeof userId === "string") && !(typeof userId === "undefined")) {
      req.userId = userId;
    }
    next();
  });
}
