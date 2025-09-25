const express = require('express');
const router = express.Router();


// Make sure the path to your controller is correct
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const { protect } = require('../middleware/authMiddleware');
const { validateBook } = require("../middleware/bookValidation");
 // path must be correct
// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected routes (require token)
router.post('/', protect, validateBook, createBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);


module.exports = router;
