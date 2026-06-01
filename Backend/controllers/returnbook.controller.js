const ReturnBook = require("../models/Library/returnBook.model");
const IssueBook = require("../models/Library/IssueBook");

exports.createReturnBook = async (req, res) => {
    try {
      const { issueBook, fine, paid, discount } = req.body;
  
      const issued = await IssueBook.findById(issueBook);
  
      if (!issued) {
        return res.status(404).json({ message: "Issued book not found" });
      }
  
      const returnData = await ReturnBook.create({
        issueBook: issued._id,
        student: issued.student,
        book: issued.book,
        fine: fine || 0,
        paid: paid || 0,
        discount: discount || 0,
      });
  
      // clear issue book DB
      await IssueBook.findByIdAndDelete(issueBook);
  
      res.status(201).json({
        success: true,
        message: "Book returned successfully and issue record removed",
        data: returnData,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getReturnBooks = async (req, res) => {
  try {
    const data = await ReturnBook.find()
      .populate("issueBook")
      .populate("student")
      .populate("book")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateReturnBook = async (req, res) => {
  try {
    const returnBook = await ReturnBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!returnBook) {
      return res.status(404).json({
        success: false,
        message: "Return book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Return book updated successfully",
      data: returnBook,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteReturnBook = async (req, res) => {
  try {
    const returnBook = await ReturnBook.findByIdAndDelete(req.params.id);

    if (!returnBook) {
      return res.status(404).json({
        success: false,
        message: "Return book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Return book deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
