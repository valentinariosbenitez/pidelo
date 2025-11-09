// controllers/createTables.js
const pool = require('../db/pool');

const createTables = async (req, res) => {
  try {
    // 🔹 Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false
      );
    `);

    // 🔹 Tabla de libros
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
        available_quantity INTEGER NOT NULL CHECK (available_quantity >= 0)
      );
    `);

    // 🔹 Tabla de préstamos (relaciona usuarios y libros)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        loan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        return_date TIMESTAMP
      );
    `);

    // 🔹 Tabla de historial de préstamos (opcional / independiente)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prestamos (
        id SERIAL PRIMARY KEY,
        nombre_libro VARCHAR(150) NOT NULL,
        fecha_prestamo DATE NOT NULL,
        fecha_devolucion DATE NOT NULL
      );
    `);

    // ✅ Si todo va bien:
    if (res) {
      res.send('✅ Tablas creadas correctamente');
    } else {
      console.log('✅ Tablas creadas correctamente');
    }

  } catch (error) {
    console.error('❌ Error al crear tablas:', error.message);
    if (res) {
      res.status(500).send('❌ Error al crear las tablas');
    }
  }
};

module.exports = createTables;

