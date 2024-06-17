"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
    });
}
exports.generateAccessToken = generateAccessToken;
