const express = require("express");
const router = express.Router();

const {
  createIssueBook,
  getIssueBooks,
  deleteIssueBook,
  updateIssueBook
} = require("../controllers/issueBook.controller");

router.post("/", createIssueBook);
router.get("/", getIssueBooks);
router.delete("/:id", deleteIssueBook);
router.put("/:id", updateIssueBook);

module.exports = router;