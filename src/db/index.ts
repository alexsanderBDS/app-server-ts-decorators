import { Pool, QueryResult } from "pg";
import "./db.env";

export class PgDb {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    });
  }

  public query<T>(text: string, params?: T[]): Promise<QueryResult<any>> {
    return this.pool.query(text, params);
  }
}
