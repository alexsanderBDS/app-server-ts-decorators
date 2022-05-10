import express, { Request, Response } from "express";
import { App } from "./App";
import cors from "cors";
import "./controllers/Root";
import "./controllers/User";
import "./controllers/Thoughts";
import "./controllers/Auth";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(App.getRoute());

app.listen(port, () => {
  console.log("Running server on port " + port);
});
