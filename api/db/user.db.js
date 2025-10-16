import pool from "../config/db.js";

export const userDb = {
  getAllUsersDb: async () => {
    const { rows: users } = await pool.query("select * from users");
    return users;
  },

  createUserDb: async ({ email, password }) => {
    const { rows: user } = await pool.query(
      `INSERT INTO users(email, password) 
    VALUES($1, $2) 
    returning id, email`,
      [email, password]
    );
    return user[0];
  },

  getUserByEmailDb: async (email) => {
    const { rows: user } = await pool.query(
      "select * from users where lower(email) = lower($1)",
      [email]
    );
    return user[0];
  },
};
