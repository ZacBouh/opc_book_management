"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
    });
}
exports.generateAccessToken = generateAccessToken;
function authenticateToken(req, res, next) {
    const authHeader = req.get("authorization");
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (token == null) {
        console.log("\\x1b[31m" + "[ERROR]" + "\\x1b[0m" + "auth failed ");
        return res.status(401);
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, userId) => {
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
exports.authenticateToken = authenticateToken;
