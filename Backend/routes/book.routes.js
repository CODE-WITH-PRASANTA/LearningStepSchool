const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  deleteBook,
  updateBook,
} = require("../controllers/book.controller");

router.post("/", createBook);
router.get("/", getBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;