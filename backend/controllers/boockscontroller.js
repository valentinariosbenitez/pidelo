// controllers/booksController.js
const pool = require('../db');

// Agregar un libro
exports.addBook = async (req, res) => {
  const { title, author, total_quantity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, total_quantity, available_quantity)
       VALUES ($1, $2, $3, $3) RETURNING *`,
      [title, author, total_quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los libros o uno por ID
exports.getBooks = async (req, res) => {
  const { id } = req.params;
  try {
    const result = id
      ? await pool.query('SELECT * FROM books WHERE id = $1', [id])
      : await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// lista de libros ordenada 
exports.getBooks = async (req, res) => {
  try {
    // Consulta todos los libros ordenados por título (puedes cambiar el criterio)
    const result = await pool.query('SELECT id, titulo, autor, genero FROM books ORDER BY titulo ASC');
   
    // Devuelve los resultados como JSON
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener los libros:', err);
    res.status(500).json({ error: 'Error al obtener la lista de libros' });
  }
};
// Modificar un libro
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, total_quantity, available_quantity } = req.body;
  try {
    const result = await pool.query(
      `UPDATE books SET title = $1, author = $2, total_quantity = $3, available_quantity = $4
       WHERE id = $5 RETURNING *`,
      [title, author, total_quantity, available_quantity, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un libro
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
