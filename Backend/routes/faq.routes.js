const express = require("express");
const router = express.Router();

const {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
} = require("../controllers/faq.controller");

router.post("/", createFaq);
router.get("/", getFaqs);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

module.exports = router;