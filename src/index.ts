import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
const path = require("path");

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
    // res.send("Welcome to Express & TypeScript Server");
  res.sendFile(path.join(__dirname, "/../", "index.html"));
});
app.get("/test", (req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server");
});
app.use(express.static(__dirname + "/../public"));

app.listen(port, () => {
  console.log(`Server is started at http://localhost:${port}`);
});
