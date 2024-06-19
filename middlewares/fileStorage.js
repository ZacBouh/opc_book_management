"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBookImage = void 0;
const multer_1 = __importDefault(require("multer"));
require("dotenv/config");
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, process.env.PICTURES_FOLDER_PATH);
    },
    filename: (req, file, cb) => {
        const userId = req.userId.userId;
        const uniquePrefix = Date.now() + "_" + userId + "_";
        cb(null, uniquePrefix + file.originalname);
    },
});
exports.uploadBookImage = (0, multer_1.default)({ storage }).single("image");
