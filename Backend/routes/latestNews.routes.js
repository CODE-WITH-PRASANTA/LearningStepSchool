const express = require("express");
const router = express.Router();

const {
  createNews,
  getAllNews,
  deleteNews,
  toggleNews,
} = require("../controllers/latestNews.controller");

router.post("/", createNews);
router.get("/", getAllNews);
router.delete("/:id", deleteNews);
router.patch("/toggle/:id", toggleNews);

module.exports = router;
