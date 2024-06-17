import { NextFunction } from "express";
import { Response } from "express";
import jwt from "jsonwebtoken";

type authorizedRequest = Response & {
  userId?: string | jwt.JwtPayload | undefined;
};

function authenticateToken(
  req: authorizedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (token == null) return res.status(401);

  jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret, (err, userId) => {
    if (err) {
      console.log("[ERROR] auth middleware error ", err);
      return res.status(403);
    }
    req.userId = userId;
    next();
  });
}
