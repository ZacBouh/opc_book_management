"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./controllers/user");
const app = (0, express_1.default)();
const port = 3000;
mongoose_1.default.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6").then(() => console.log('successfull connection to db')).catch((er) => console.log('error connecting to db', er));
app.use(express_1.default.json());
// app.use(express.urlencoded({extended : true}))
app.get('/', (req, res) => {
    res.send('Hello it works');
});
app.post('/api/auth/signup', (req, res) => {
    var _a, _b;
    console.log(`sign up request received with ${(_a = req.body) === null || _a === void 0 ? void 0 : _a.email} and ${(_b = req.body) === null || _b === void 0 ? void 0 : _b.password}`);
    (0, user_1.createUser)(req.body.email, req.body.password, res);
});
app.post('/api/auth/login', (req, res) => {
});
app.get('/api/auth/users', (req, res) => {
    console.log('request for users');
    const getRequest = (0, user_1.getUsers)();
    getRequest
        .then((users) => res.status(201).json(users))
        .catch(error => res.status(400).json(error));
});
app.listen(port, () => console.log(`listening on port ${port} is ok
`));
