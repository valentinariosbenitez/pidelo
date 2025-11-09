
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verificarToken = require('../middleware/authmiddleware');

router.post('/', verificarToken, reviewController.createReview);
router.get('/', reviewController.getReviews);
router.delete('/:id', verificarToken, reviewController.deleteReview);

module.exports = router;