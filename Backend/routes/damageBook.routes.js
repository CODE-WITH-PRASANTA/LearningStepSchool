const express = require("express");
const router = express.Router();

const {
  createDamageBook,
  getDamageBooks,
  updateDamageBook,
  deleteDamageBook,
} = require("../controllers/damageBook.controller");

router.post("/", createDamageBook);
router.get("/", getDamageBooks);
router.put("/:id", updateDamageBook);
router.delete("/:id", deleteDamageBook);

module.exports = router;