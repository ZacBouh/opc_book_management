import express from "express";
import mongoose from "mongoose";
import { createUser, getUsers, loginUser } from "./controllers/user";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = 4000;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_ADDRESS}`
  )
  .then(() => console.log("successfull connection to db test"))
  .catch((er) => console.log("error connecting to db", er));

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
// app.use(express.urlencoded({extended : true}))

app.get("/", (req, res) => {
  res.send("Hello it works");
});

app.post("/api/auth/signup", (req, res) => {
  console.log(
    `sign up request received with ${req.body?.email} and ${req.body?.password}`
  );
  createUser(req.body.email, req.body.password, res);
});

app.post("/api/auth/login", (req, res) => {
  console.log(
    `login request received with ${req.body?.email} and ${req.body?.password}`
  );
  loginUser(req.body?.email, req.body?.password, res);
});

app.get("/api/auth/users", (req, res) => {
  console.log("request for users");
  const getRequest = getUsers();
  getRequest
    .then((users) => res.status(201).json(users))
    .catch((error) => res.status(400).json(error));
});

app.listen(port, () =>
  console.log(`listening on port ${port}
`)
);
