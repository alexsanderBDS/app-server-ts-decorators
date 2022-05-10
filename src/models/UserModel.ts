import { QueryResult } from "pg";
import { PgDb } from "../db";

export interface NewUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
  token?: string;
}

export interface UpdateUser {
  id: number;
  password: string;
}

export class UserModel extends PgDb {
  async getAll(): Promise<any> {
    const result = await this.query("SELECT * FROM users ORDER BY id ASC");
    return result.rows;
  }

  async getUser(
    keys: string[],
    keyToFind: string,
    value: string
  ): Promise<QueryResult> {
    let keyToParse: string = "";

    keys.forEach((key: string) => {
      keyToParse = keyToParse + key + ",";
    });

    keyToParse = keyToParse.substring(0, keyToParse.length - 1);

    const result = await this.query(
      `SELECT ${keyToParse} FROM users WHERE ${keyToFind} = $1`,
      [value]
    );
    return result;
  }

  async insertUser(
    email: string,
    password: string,
    createdAt: Date
  ): Promise<any> {
    const result = await this.query(
      "INSERT INTO users(email, password,createdat) VALUES ($1, $2, $3)",
      [email, password, createdAt]
    );

    return result.rows;
  }

  async updateUserPasword(
    keys: string[],
    values: any[],
    idUser: number
  ): Promise<QueryResult> {
    let keyToParse: string = "";

    keys.forEach((key: string, index: number) => {
      keyToParse = keyToParse + `${key} = $${index + 1}` + ",";
    });

    keyToParse = keyToParse.substring(0, keyToParse.length - 1);

    const result = await this.query(
      `UPDATE users SET ${keyToParse} WHERE id=$${keys.length + 1}`,
      [...values, idUser]
    );
    return result;
  }

  async deleteUser(userId: string): Promise<QueryResult> {
    const result = await this.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);
    return result;
  }
}
