"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function dbConnect() {
    mongoose_1.default
        .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_ADDRESS}`)
        .then(() => console.log("successfull connection to db test"))
        .catch((err) => console.log("[ERROR] could not connect to db", err));
}
exports.default = dbConnect;
