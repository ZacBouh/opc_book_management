"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressImage = exports.uploadBookImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const multer_1 = __importDefault(require("multer"));
require("dotenv/config");
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, process.env.PICTURES_FOLDER_PATH);
    },
    filename: (req, file, cb) => {
        const userId = req.userId.userId;
        const uniquePrefix = Date.now() + "_" + userId + "_" + Math.floor(Math.random() * 10000);
        cb(null, uniquePrefix + path_1.default.extname(file.originalname));
    },
});
exports.uploadBookImage = (0, multer_1.default)({ storage }).single("image");
function compressImage(req, res, next) {
    if (!req.file) {
        console.log("[WARNING] compressImage middleware : no image to compress");
        return next();
    }
    const compressedImagePath = path_1.default.dirname(req.file.path) +
        "/" +
        path_1.default.basename(req.file.path).replace(path_1.default.extname(req.file.path), ".webp");
    try {
        sharp_1.default.cache(false);
        (0, sharp_1.default)(req.file.path)
            .webp({ nearLossless: true })
            .toFile(compressedImagePath, (err, info) => {
            if (err) {
                console.log("[ERROR] failed to compress image ", err);
                res.status(500).json(err);
                return;
            }
            console.log("[INFO] compressImage middleware : successfully compressed image ", path_1.default.basename(compressedImagePath));
            if (req.file) {
                fs_1.default.unlink(req.file.path, (err) => {
                    if (err)
                        return console.log("[ERROR] compressImage middleware : could not remove original image ", err);
                });
                req.file.path = compressedImagePath;
            }
            next();
        });
    }
    catch (err) {
        console.log("[ERROR] compressImage middleware : failed to compress image ", err);
        res.status(500).json(err);
        return;
    }
}
exports.compressImage = compressImage;
