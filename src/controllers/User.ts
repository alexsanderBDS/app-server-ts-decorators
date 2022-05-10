import { Request, Response } from "express";
import { controller, del, get, patch, post } from "./decorators";
import bcrypt from "bcryptjs";
import { NewUser, UpdateUser, UserModel } from "../models/UserModel";

@controller("")
class User {
  private static users: UserModel = new UserModel();

  static hashPassword(saltNumber: number, password: string): string {
    const salt: string = bcrypt.genSaltSync(saltNumber);
    return bcrypt.hashSync(password, salt);
  }

  @get("/users")
  async getUsers(req: Request, res: Response) {
    try {
      const result = await User.users.getAll();
      res.json(result);
    } catch (error: string | any) {
      console.log(error);
      res.sendStatus(404);
    }
  }

  @get("/users/user/:id")
  async getUser(req: Request, res: Response) {
    const id: string = req.params.id;
    const result = await User.users.getUser(["*"], "id", id);
    res.json(result.rows);
  }

  @post("/users/new")
  async createUser(req: Request, res: Response) {
    const body: NewUser = req.body;

    const hash: string = User.hashPassword(10, body.password);

    const result = await User.users.insertUser(
      body.email,
      hash,
      body.createdAt
    );

    console.log("User created", result);
    res.sendStatus(200);
  }

  @patch("/users/user/me")
  async updateUserPassword(req: Request, res: Response) {
    const body: UpdateUser = req.body;

    const hash: string = User.hashPassword(10, body.password);
    const result = await User.users.updateUserPasword(
      ["password", "updatedAt"],
      [hash, new Date()],
      body.id
    );

    res.json(result);
  }

  @del("/users/delete/user/:id")
  async deleteUser(req: Request, res: Response) {
    const id: string = req.params.id;
    const result = await User.users.deleteUser(id);
    res.json(result);
  }
}
