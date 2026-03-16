const express = require("express");
const router = express.Router();

const {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} = require("../controllers/class.controller");

/* ================= CREATE CLASS ================= */

router.post("/classes", createClass);

/* ================= GET CLASSES ================= */

router.get("/classes", getClasses);

/* ================= UPDATE CLASS ================= */

router.put("/classes/:id", updateClass);

/* ================= DELETE CLASS ================= */

router.delete("/classes/:id", deleteClass);

module.exports = router;