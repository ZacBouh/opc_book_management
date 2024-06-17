"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.loginUser = exports.createUser = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const auth_1 = require("../middlewares/auth");
function createUser(email, password, res) {
    if (!email || !password) {
        res.status(400).json({ message: "a user email and password is required" });
        console.log("received a signup request with no email or password");
        return;
    }
    bcrypt_1.default.hash(password, 10, (err, hash) => {
        if (err)
            return res.status(400).json(err);
        const newUser = new user_1.User({ email, password: hash });
        newUser
            .save()
            .then(() => res.status(201).json({ message: "user created" }))
            .catch((err) => res.status(400).json(err));
    });
}
exports.createUser = createUser;
function loginUser(email, password, res) {
    let dbrequest = null;
    try {
        dbrequest = user_1.User.findOne({ email: email }).exec();
    }
    catch (err) {
        res.status(400).json({ message: `error requesting the db ${err}` });
    }
    dbrequest === null || dbrequest === void 0 ? void 0 : dbrequest.then((user) => {
        if (!user) {
            console.log("user not found in db");
            res.statusMessage = "user not found";
            res.status(401).json({ message: "user not found" });
            return;
        }
        bcrypt_1.default.compare(password, user.password, (err, result) => {
            if (err) {
                console.log("[ERROR] cheking user password", err);
                res.status(500).json({ message: "error checking user password" });
                return;
            }
            if (!result) {
                console.log("wrong password");
                res.status(401).json({ message: "wrong password" });
            }
            console.log(`${email} successfully logged in`);
            console.log("user id is : ", user._id);
            res.status(200).json({
                userId: user._id.toString(),
                token: (0, auth_1.generateAccessToken)(user._id.toString()),
            });
        });
    }, (err) => {
        console.log("error requesting the db", err);
        res.status(500).json({ message: err });
    });
}
exports.loginUser = loginUser;
function getUsers() {
    return user_1.User.find();
}
exports.getUsers = getUsers;
