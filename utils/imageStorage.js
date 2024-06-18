"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImagePath = exports.getImageUrl = void 0;
const path_1 = __importDefault(require("path"));
require("dotenv/config");
function getImageUrl(req) {
    if (!req.file)
        throw new Error("getImageUrl error : req.file doesnt exist");
    return "http://" + req.get("host") + "/" + path_1.default.basename(req.file.path);
}
exports.getImageUrl = getImageUrl;
function getImagePath(imageUrl) {
    return (process.env.PICTURES_FOLDER_PATH +
        "\\" +
        path_1.default.basename(imageUrl));
}
exports.getImagePath = getImagePath;
