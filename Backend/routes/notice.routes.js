const express = require("express");
const router = express.Router();

const {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/notice.controller");

const { upload, convertToWebp } = require("../middleware/upload");

/* ================= ROUTES ================= */

router.post("/", upload.single("image"), convertToWebp, createNotice);

router.get("/", getAllNotices);

router.get("/:id", getNoticeById);

router.put("/:id", upload.single("image"), convertToWebp, updateNotice);

router.delete("/:id", deleteNotice);

module.exports = router;