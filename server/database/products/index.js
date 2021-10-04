const { Pool } = require('pg');
const { dbConfig } = require('./config.js');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  max: 100,
  database: 'SDC_Products',
  password: dbConfig.password,
  port: process.env.PORT || 5432
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
  end: () => {
    pool.end()
  }
}