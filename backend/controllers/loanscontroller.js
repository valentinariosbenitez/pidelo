
const pool = require('../db/pool');

exports.createLoan = async (req, res) => {
  const { user_id, book_id,return_date : fecha_devolucion   } = req.body;
  try {
    await pool.query('BEGIN');

    const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [book_id]);
    const book = bookResult.rows[0];

    if (!book) {
      throw new Error('Libro no encontrado');
    }
    if (book.available_quantity <= 0) {
      throw new Error('No hay ejemplares disponibles');
    }

    const loanResult = await pool.query(
      `INSERT INTO loans (user_id, book_id)
       VALUES ($1, $2) RETURNING *`,
      [user_id, book_id]
    );

    await pool.query(
      `UPDATE books SET available_quantity = available_quantity - 1
       WHERE id = $1`,
      [book_id]
    );

    await pool.query('COMMIT');
    res.status(201).json(loanResult.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};

// exports.getLoans = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT loans.*, users.name as user_name, books.title as book_title
//       FROM loans
//       JOIN users ON users.id = loans.user_id
//       JOIN books ON books.id = loans.book_id
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getLoans = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        loans.id,
        users.name AS usuario,
        books.title AS libro,
        loans.loan_date AS fecha_prestamo,
        loans.return_date AS fecha_devolucion
      FROM loans
      JOIN users ON users.id = loans.user_id
      JOIN books ON books.id = loans.book_id
      ORDER BY loans.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener préstamos:', err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteLoan = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('BEGIN');

    const loanResult = await pool.query('SELECT * FROM loans WHERE id = $1', [id]);
    const loan = loanResult.rows[0];

    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    await pool.query('DELETE FROM loans WHERE id = $1', [id]);

    await pool.query(
      `UPDATE books SET available_quantity = available_quantity + 1
       WHERE id = $1`,
      [loan.book_id]
    );

    await pool.query('COMMIT');
    res.status(204).send();
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};

exports.updateLoan = async (req, res) => {
  const { id } = req.params;
  const { loan_date, return_date } = req.body;

  try {
    await pool.query('BEGIN');

    // Verificar que el préstamo exista
    const loanResult = await pool.query('SELECT * FROM loans WHERE id = $1', [id]);
    const loan = loanResult.rows[0];

    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    // Construir dinámicamente el UPDATE según los campos enviados
    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (loan_date) {
      fields.push(`loan_date = $${queryIndex++}`);
      values.push(loan_date);
    }

    if (return_date) {
      fields.push(`return_date = $${queryIndex++}`);
      values.push(return_date);
    }

    if (fields.length === 0) {
      throw new Error('No se enviaron campos para actualizar');
    }

    values.push(id);

    const query = `
      UPDATE loans
      SET ${fields.join(', ')}
      WHERE id = $${queryIndex}
      RETURNING *;
    `;

    const updateResult = await pool.query(query, values);

    await pool.query('COMMIT');
    res.json({
      message: '✅ Préstamo actualizado correctamente',
      loan: updateResult.rows[0],
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('❌ Error al actualizar préstamo:', err.message);
    res.status(500).json({ error: err.message });
  }
};

