"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.createUser = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser(email, password, res) {
    bcrypt_1.default.hash(password, 10, (err, hash) => {
        if (err)
            return res.status(400).json(err);
        const newUser = new user_1.User({ email, password: hash });
        newUser.save()
            .then(() => res.status(201).json({ message: 'user created' }))
            .catch(err => res.status(400).json(err));
    });
}
exports.createUser = createUser;
function getUsers() {
    return user_1.User.find();
}
exports.getUsers = getUsers;
