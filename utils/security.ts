import jwt from "jsonwebtoken";
import "dotenv/config";

export function generateAccessToken(userId: String) {
  return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET as jwt.Secret, {
    expiresIn: "1h",
  });
}
