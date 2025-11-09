
const pool = require('../db/pool');

exports.createReview = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) return res.status(400).json({ error: 'Contenido requerido' });

  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, content) VALUES ($1, $2) RETURNING *',
      [userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ error: 'Error al guardar reseña' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.content, r.created_at, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reseñas:', error.message);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

exports.deleteReview = async (req, res) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Acceso solo para administradores' });
  }

  const reviewId = req.params.id;

  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error.message);
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
};