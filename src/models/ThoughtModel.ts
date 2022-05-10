import { PgDb } from "../db";

export interface Thought {
  thought: string;
  user_id: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class ThoughtModel extends PgDb {
  async getAllThoughts(): Promise<any> {
    const result = await this.query("SELECT * FROM thoughts ORDER BY id ASC");
    return result.rows;
  }

  async getThought(id: string): Promise<any> {
    const result = await this.query("SELECT * FROM thoughts WHERE id = $1", [
      id,
    ]);
    return result.rows;
  }

  async setThought(thought: string, userId: number): Promise<any> {
    const result = await this.query(
      "INSERT INTO thoughts(thought, user_id, createdAt) VALUES($1, $2, $3)",
      [thought, userId, new Date()]
    );
    return result.rows;
  }
}
