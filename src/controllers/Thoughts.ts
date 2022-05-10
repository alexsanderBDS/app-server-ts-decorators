import { controller, get, post } from "./decorators";
import { Request, Response } from "express";
import { ThoughtModel, Thought } from "../models/ThoughtModel";

@controller("")
class Thoughts {
  private static thoughts: ThoughtModel = new ThoughtModel();

  @get("/thoughts")
  async getAllThoughts(req: Request, res: Response) {
    const result = await Thoughts.thoughts.getAllThoughts();
    res.json(result);
  }

  @get("/thoughts/thought/:id")
  async getThought(req: Request, res: Response) {
    const params = req.params;

    const result = await Thoughts.thoughts.getThought(params.id);

    res.json(result);
  }

  @post("/thoughts/thought/new")
  async createThought(req: Request, res: Response) {
    const body: Thought = req.body;

    try {
      const result = await Thoughts.thoughts.setThought(
        body.thought,
        body.user_id
      );

      res.json(result);
    } catch (error: any) {
      res.send(error.message);
    }
  }
}
