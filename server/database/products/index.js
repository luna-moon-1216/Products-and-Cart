const { Pool } = require('pg');
const { dbConfig } = require('./config.js');

const pool = new Pool({
  user: 'ubuntu',
  host: '3.84.145.8',
  database: 'sdc_products',
  password: dbConfig.password,
  port: process.env.PORT || 5432
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
  })
})


// module.exports = {
//   query: (text, params, callback) => {
//     return pool.query(text, params, callback)
//   },
//   end: () => {
//     pool.end()
//   }
// }
module.exports = pool;