const express = require("express");
const router = express.Router();

const {
  createAward,
  getAllAwards,
  updateAward,
  deleteAward,
} = require("../controllers/award.controller");

const { upload, convertToWebp } = require("../middleware/upload");

router.post("/", upload.single("image"), convertToWebp, createAward);
router.get("/", getAllAwards);
router.put("/:id", upload.single("image"), convertToWebp, updateAward);
router.delete("/:id", deleteAward);

module.exports = router;