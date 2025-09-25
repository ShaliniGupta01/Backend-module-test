const Book = require('../models/Book');

//  GET all books
//  GET /api/books
exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate('user', 'name email');
    res.json(books);
  } catch (err) {
    next(err);
  }
};

//  Get single book by ID
//  GET /api/books/:id
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('user', 'name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

//  Create new book (protected)
//  POST /api/books
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, genre, price, inStock } = req.body;

    // req.user is set by authMiddleware
    const book = await Book.create({
      title,
      author,
      genre,
      price,
      inStock,
      user: req.user._id
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

//  Update book (only owner can update)
// PUT /api/books/:id
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Debug: log IDs
    console.log('Book owner:', book.user.toString());
    console.log('Logged-in user:', req.user._id.toString());

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete book (only owner can delete)
//  DELETE /api/books/:id
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Debug: log IDs
    console.log('Book owner:', book.user.toString());
    console.log('Logged-in user:', req.user._id.toString());

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (err) {
    next(err);
  }
};
