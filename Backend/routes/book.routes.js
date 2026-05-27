const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  deleteBook,
} = require("../controllers/book.controller");

router.post("/", createBook);
router.get("/", getBooks);
router.delete("/:id", deleteBook);

module.exports = router;