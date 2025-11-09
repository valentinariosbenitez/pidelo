// routes.js
const express = require('express');
const router = express.Router();
const booksController = require('./controllers/booksController');
const loansController = require('./controllers/loansController');

// Libros
router.post('/books', booksController.addBook);
router.get('/books/:id?', booksController.getBooks);
router.put('/books/:id', booksController.updateBook);
router.delete('/books/:id', booksController.deleteBook);

// Préstamos
router.post('/loans', loansController.createLoan);
router.get('/loans', loansController.getLoans);
router.delete('/loans/:id', loansController.deleteLoan);


module.exports = router;
