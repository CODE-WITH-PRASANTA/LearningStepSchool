const IssueBook = require("../models/Library/IssueBook");

exports.createIssueBook = async (req, res) => {
  try {
    const { student, book, qty } = req.body;

    // CHECK SAME BOOK ALREADY ISSUED
    const alreadyIssued = await IssueBook.findOne({
      student,
      book,
      status: "issued",
    });

    if (alreadyIssued) {
      return res.status(400).json({
        success: false,
        message:
          "This student already issued this book and has not returned it yet",
      });
    }

    const issueBook = await IssueBook.create({
      student,
      book,
      qty,
      status: "issued",
    });

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: issueBook,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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

exports.updateIssueBook = async (req, res) => {
  try {
    const issueBook = await IssueBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!issueBook) {
      return res.status(404).json({ message: "Issue book not found" });
    }

    res.status(200).json({
      success: true,
      message: "Issue book updated successfully",
      data: issueBook,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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
