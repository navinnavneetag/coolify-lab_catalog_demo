import pkg from "pg";
import poolConfig from "./pool.config.js";

const { Pool } = pkg;

const pool = new Pool(poolConfig);

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection test successful');
    client.release();
  } catch (err) {
    console.error('Error testing database connection:', {
      host: poolConfig.host,
      user: poolConfig.user,
      port: poolConfig.port,
      database: poolConfig.database,
      error: err.message
    });
    process.exit(1);
  }
};

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

testConnection();

export default pool;
