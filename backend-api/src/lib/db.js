const { Pool } = require("pg");
require("dotenv").config();

class Database {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: "localhost",
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: 5432,
    });
  }

  async query(text, params) {
    const res = await this.pool.query(text, params);
    return res;
  }

  async getConnection() {
    return await this.pool.connect();
  }
}

module.exports = new Database();
