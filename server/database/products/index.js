const { Pool } = require('pg');
const { dbConfig } = require('./config.js');

const pool = new Pool({
  user: 'ubuntu',
  host: '52.201.222.82',
  // host: 'host.docker.internal',
  database: 'sdc_products',
  password: dbConfig.password,
  port: 5432
});

// module.exports = {
//   query: (text, params, callback) => {
//     return pool.query(text, params, callback)
//   },
//   end: () => {
//     pool.end()
//   }
// };

pool.connect((err, client, done) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    done();
    if (err) {
      return console.error("Error executing query", err.stack);
    } else {
    console.log("CONNECTED: ", result.rows);
    }
  });
});

module.exports = pool;