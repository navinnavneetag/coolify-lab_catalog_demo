import config from "../utils/config.js";

const poolConfig = {
  host: config.POSTGRES_HOST,
  user: config.POSTGRES_USER,
  port: config.POSTGRES_DB_PORT,
  database: config.POSTGRES_DATABASE,
  password: config.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false },
};

export default poolConfig;
