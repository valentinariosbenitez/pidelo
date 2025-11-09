// utils/insertData.js
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const insertData = async (req, res) => {
  try {
    console.log('🧹 Eliminando datos existentes...');

    // Eliminar datos en orden correcto para evitar conflictos con llaves foráneas
    await pool.query('DELETE FROM loans;');
    await pool.query('DELETE FROM prestamos;');
    await pool.query('DELETE FROM books;');
    await pool.query('DELETE FROM users;');

    console.log('✅ Datos antiguos eliminados');

    // 🔹 Encriptar contraseñas
    const adminPass = await bcrypt.hash('admin123', 10);
    const valentinaPass = await bcrypt.hash('valentina123', 10);
    const carlosPass = await bcrypt.hash('carlos123', 10);
    const lauraPass = await bcrypt.hash('laura123', 10);

    // 🔹 Insertar usuarios
    await pool.query(`
      INSERT INTO users (name, email, password, is_admin)
      VALUES
        ('Admin', 'admin@example.com', '${adminPass}', true),
        ('Valentina López', 'valentina@example.com', '${valentinaPass}', false),
        ('Carlos Pérez', 'carlos@example.com', '${carlosPass}', false),
        ('Laura Gómez', 'laura@example.com', '${lauraPass}', false);
    `);

    console.log('✅ Usuarios insertados');

    // 🔹 Insertar libros
    await pool.query(`
      INSERT INTO books (title, author, total_quantity, available_quantity)
      VALUES
        ('Cien Años de Soledad', 'Gabriel García Márquez', 10, 8),
        ('El Principito', 'Antoine de Saint-Exupéry', 5, 5),
        ('1984', 'George Orwell', 7, 6),
        ('Don Quijote de la Mancha', 'Miguel de Cervantes', 4, 4),
        ('Harry Potter y la Piedra Filosofal', 'J.K. Rowling', 12, 11);
    `);

    console.log('✅ Libros insertados');

    // 🔹 Obtener IDs para relacionar préstamos
    const { rows: users } = await pool.query('SELECT id FROM users ORDER BY id ASC;');
    const { rows: books } = await pool.query('SELECT id FROM books ORDER BY id ASC;');

    // 🔹 Insertar préstamos
    await pool.query(`
      INSERT INTO loans (user_id, book_id, loan_date, return_date)
      VALUES
        (${users[1].id}, ${books[0].id}, NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days'),
        (${users[2].id}, ${books[1].id}, NOW() - INTERVAL '4 days', NULL);
    `);

    console.log('✅ Préstamos insertados');

    // 🔹 Insertar historial de préstamos
    await pool.query(`
      INSERT INTO prestamos (nombre_libro, fecha_prestamo, fecha_devolucion)
      VALUES
        ('Cien Años de Soledad', '2025-10-01', '2025-10-10'),
        ('El Principito', '2025-10-05', '2025-10-12'),
        ('1984', '2025-10-07', '2025-10-15');
    `);

    console.log('✅ Historial de préstamos insertado');

    if (res) {
      res.send('✅ Base de datos limpiada y datos insertados correctamente');
    } else {
      console.log('✅ Base de datos limpiada y datos insertados correctamente');
    }

  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
    if (res) {
      res.status(500).send(`❌ Error al insertar datos: ${error.message}`);
    }
  }
};

module.exports = insertData;
