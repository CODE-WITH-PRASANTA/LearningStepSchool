const express = require("express");
const router = express.Router();

const {
  createResult,
  getResults,
  updateResult,
  deleteResult
} = require("../controllers/examResult.controller");


router.post("/", createResult);
router.get("/", getResults);
router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

module.exports = router;