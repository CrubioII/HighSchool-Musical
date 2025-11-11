const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

/**
 * Create and export a PostgreSQL connection pool.
 *
 * The credentials are loaded from environment variables. A single pool is
 * shared across the application to efficiently manage connections.
 */
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = {
  /**
   * Executes a parameterized SQL query. Use this helper to avoid SQL injection.
   *
   * @param {string} text SQL query text with placeholders (e.g. $1, $2)
   * @param {Array<any>} params Array of values to substitute into the query
   * @returns {Promise<import('pg').QueryResult>}
   */
  query: (text, params) => pool.query(text, params),
  /**
   * Returns the underlying pool instance. Useful for transactions.
   */
  pool,
};