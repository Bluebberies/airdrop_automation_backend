"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use(helmet());
app.use(compression());
app.get("/", (req, res) => {
    // res.send("Welcome to Express & TypeScript Server");
    res.sendFile(path.join(__dirname, "/../", "index.html"));
});
app.get("/test", (req, res) => {
    res.send("Welcome to Express & TypeScript Server");
});
app.use(express_1.default.static(__dirname + "/../public"));
app.listen(port, () => {
    console.log(`Server is started at http://localhost:${port}`);
});
