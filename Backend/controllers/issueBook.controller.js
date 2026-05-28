const IssueBook = require("../models/Library/IssueBook");

exports.createIssueBook = async (req, res) => {
  try {
    const { student, book, returnDate, qty } = req.body;

    if (!student || !book) {
      return res.status(400).json({
        message: "Student and book are required",
      });
    }

    const issueBook = await IssueBook.create({
      student,
      book,
      returnDate,
      qty: qty || 1,
    });

    res.status(201).json({
      message: "Book issued successfully",
      data: issueBook,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to issue book",
    });
  }
};

exports.getIssueBooks = async (req, res) => {
  try {
    const issueBooks = await IssueBook.find()
      .populate("student")
      .populate("book")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Issued books fetched successfully",
      data: issueBooks,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch issued books",
    });
  }
};

exports.deleteIssueBook = async (req, res) => {
  try {
    await IssueBook.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Issue book deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete issue book",
    });
  }
};