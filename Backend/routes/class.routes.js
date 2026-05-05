const express = require("express");
const router = express.Router();

const {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} = require("../controllers/class.controller");

router.post("/", createClass);
router.get("/", getClasses);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

module.exports = router;