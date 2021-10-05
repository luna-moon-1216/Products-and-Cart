const { Pool } = require('pg');
const { dbConfig } = require('./config.js');

const pool = new Pool({
  user: 'ubuntu',
  host: '3.84.145.8',
  max: 100,
  database: 'sdc_products',
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