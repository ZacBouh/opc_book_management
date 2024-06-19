import mongoose from "mongoose";

export default function dbConnect() {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_ADDRESS}`
    )
    .then(() => console.log("successfull connection to db test"))
    .catch((err) => console.log("[ERROR] could not connect to db", err));
}
