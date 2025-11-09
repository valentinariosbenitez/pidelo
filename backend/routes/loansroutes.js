const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loansController');

// Crear un préstamo
router.post('/', loanController.createLoan);

// Obtener todos los préstamos
router.get('/', loanController.getLoans);

// Eliminar un préstamo por ID
router.delete('/:id', loanController.deleteLoan);

router.put('/:id', loanController.updateLoan);

module.exports = router;
