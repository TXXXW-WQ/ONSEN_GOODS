require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const connectionString = process.env.EX_URL

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;