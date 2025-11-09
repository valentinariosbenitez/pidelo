const { Pool } = require('pg');
require('dotenv').config(); 
// const { Pool } = require('pg');



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'valentina',       // tu usuario de PostgreSQL
//   host: 'localhost',
//   database: 'biblioteca', // cambia por tu nombre de base
//   password: 'tu_contraseña',
//   port: 5432,
// });

module.exports = pool;

// module.exports = pool;