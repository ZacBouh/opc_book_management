import { User } from "../models/user";
import bcrypt from "bcrypt";
import { Response } from "express";
import "dotenv/config";
import { generateAccessToken } from "../utils/security";

export function createUser(email: string, password: string, res: Response) {
  if (!email || !password) {
    res.status(400).json({ message: "a user email and password is required" });
    console.log("received a signup request with no email or password");
    return;
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(400).json(err);
    const newUser = new User({ email, password: hash });
    newUser
      .save()
      .then(() => res.status(201).json({ message: "user created" }))
      .catch((err) => res.status(400).json(err));
  });
}

export function loginUser(email: string, password: string, res: Response) {
  let dbrequest = null;
  try {
    dbrequest = User.findOne({ email: email }).exec();
  } catch (err) {
    res.status(400).json({ message: `error requesting the db ${err}` });
  }

  dbrequest?.then(
    (user) => {
      if (!user) {
        console.log("user not found in db");
        res.statusMessage = "user not found";
        res.status(401).json({ message: "user not found" });
        return;
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log("[ERROR] cheking user password", err);
          res.status(500).json({ message: "error checking user password" });
          return;
        }
        if (!result) {
          console.log("wrong password");
          res.status(401).json({ message: "wrong password" });
        }
        console.log(`${email} successfully logged in`);
        res.status(200).json({
          userId: user._id.toString(),
          token: generateAccessToken(user._id.toString()),
        });
      });
    },
    (err) => {
      console.log("error requesting the db", err);
      res.status(500).json({ message: err });
    }
  );
}

export function getUsers() {
  return User.find();
}
