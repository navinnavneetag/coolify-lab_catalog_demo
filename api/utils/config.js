import dotenv from "dotenv";

dotenv.config();

const config = {
  POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || "postgres",
  POSTGRES_DB_PORT: parseInt(process.env.POSTGRES_DB_PORT || "5432"),
  PORT: parseInt(process.env.PORT || "3001"),
  SECRET: process.env.SECRET,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
};

export default config;
