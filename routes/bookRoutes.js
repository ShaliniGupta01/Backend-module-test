const express = require('express');
const router = express.Router();

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const { protect } = require('../middleware/authMiddleware');
const { validateBook } = require("../middleware/bookValidation");

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected routes (require token)
router.post('/', protect, validateBook, createBook);
router.put('/:id', protect, validateBook, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
