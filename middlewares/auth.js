"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    const authHeader = req.get("authorization");
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (token == null)
        return res.status(401);
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, userId) => {
        if (err) {
            console.log("[ERROR] auth middleware error ", err);
            return res.status(403);
        }
        req.userId = userId;
        next();
    });
}
