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
exports.authenticateToken = authenticateToken;
