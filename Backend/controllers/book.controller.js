const Book = require("../models/Library/Book");

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      message: "Book added successfully",
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to add book",
    });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Books fetched successfully",
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: err.message,
    });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete book",
    });
  }
};