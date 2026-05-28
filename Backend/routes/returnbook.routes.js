const express = require("express");
const router = express.Router();

const {
  createReturnBook,
  getReturnBooks,
  updateReturnBook,
  deleteReturnBook,
} = require("../controllers/returnbook.controller");

router.post("/", createReturnBook);
router.get("/", getReturnBooks);
router.put("/:id", updateReturnBook);
router.delete("/:id", deleteReturnBook);

module.exports = router;