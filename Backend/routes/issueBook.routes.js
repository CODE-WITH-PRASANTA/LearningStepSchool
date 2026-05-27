const express = require("express");
const router = express.Router();

const {
  createIssueBook,
  getIssueBooks,
  deleteIssueBook,
} = require("../controllers/issueBook.controller");

router.post("/", createIssueBook);
router.get("/", getIssueBooks);
router.delete("/:id", deleteIssueBook);

module.exports = router;