import { Request, Response, NextFunction } from "express";
import { controller, get, use } from "./decorators";

@controller("")
class Root {
  @get("/")
  getRoot(req: Request, res: Response) {
    res.send("First Page");
  }
}
