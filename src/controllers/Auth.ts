import { controller, get, post, use } from "./decorators";
import "./controllers.env";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PgDb } from "../db";
import bcrypt from "bcryptjs";
import { Cookie, Decoded } from "../models/AuthModel";
import { UserModel } from "../models/UserModel";

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token: string = req.cookies[Cookie.authToken];

  const users: UserModel = new UserModel();

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const id = (<Decoded>decoded).id;
      const userDb = await users.getUser(["token"], "id", id);

      if (userDb.rows[0].token === token) {
        next();
        return;
      }
      res.clearCookie(Cookie.authToken);
      res.status(404).send("Unauthorized");
    }
  } catch (error: any) {
    res.clearCookie(Cookie.authToken);
    res.status(404).send("Invalid token");
  }

  res.status(404).send("You are not logged In");
}

function noRequireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.cookies[Cookie.authToken]) {
    next();
    return;
  }

  res.status(404).send("You are already logged In");
}

@controller("")
class Auth {
  static db: PgDb = new PgDb();
  private static users: UserModel = new UserModel();

  @get("/profile/me")
  @use(requireAuth)
  getProfile(req: Request, res: Response) {
    req.header("Authorization");

    res.send("Authorized Route");
  }

  @post("/auth/login")
  @use(noRequireAuth)
  async postLogin(req: Request, res: Response) {
    const { email, password }: { email: string; password: string } = req.body;

    const result = await Auth.users.getUser(["*"], "email", email);

    if (result.rowCount === 0) {
      return res.send("Email doesn't exist!");
    }

    const match = await bcrypt.compare(password, result.rows[0].password);

    if (match) {
      const token = await Auth.generateToken(res, result.rows[0].id);

      return res.json({
        email,
        password,
        token,
      });
    }

    return res.send("Password or Email doesn't match");
  }

  @post("/auth/logout")
  @use(requireAuth)
  async postLogout(req: Request, res: Response) {
    res.clearCookie(Cookie.authToken);
    return res.json({
      authStatus: "User Logout",
    });
  }

  static async generateToken(res: Response, id: number) {
    const token: string = await jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: `${process.env.JWT_EXPIRES_DAY}d`,
    });

    await Auth.users.updateUserPasword(["token"], [token], id);

    res.cookie(Cookie.authToken, token, {
      maxAge: 432000000,
      httpOnly: true,
    });

    return token;
  }
}
