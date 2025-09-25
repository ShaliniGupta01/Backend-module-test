const mongoose = require("mongoose");
const Book = require("../models/Book");

// GET all books
exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate("user", "name email");
    res.json({ success: true, data: books, message: "Books fetched successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET single book by ID
exports.getBookById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const book = await Book.findById(req.params.id).populate("user", "name email");
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    res.json({ success: true, data: book, message: "Book fetched successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// CREATE book
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, genre, price, inStock } = req.body;
    if (!title || !author) {
      return res.status(400).json({ success: false, message: "Title and Author are required" });
    }

    const book = await Book.create({
      title,
      author,
      genre,
      price,
      inStock,
      user: req.user._id
    });

    res.status(201).json({ success: true, data: book, message: "Book created successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE book
exports.updateBook = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const updatedFields = {
      title: req.body.title || book.title,
      author: req.body.author || book.author,
      genre: req.body.genre || book.genre,
      price: req.body.price || book.price,
      inStock: req.body.inStock !== undefined ? req.body.inStock : book.inStock
    };

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updatedFields, { new: true, runValidators: true });

    res.json({ success: true, data: updatedBook, message: "Book updated successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE book
exports.deleteBook = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await book.deleteOne();
    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

