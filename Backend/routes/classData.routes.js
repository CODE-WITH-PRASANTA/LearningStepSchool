const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middleware/upload");

const {
  createClassData,
  getClassData,
  updateClassData, // ✅ ADD
  deleteClassData,
} = require("../controllers/classData.controller");

router.post(
  "/",
  upload.single("image"),
  convertToWebp,
  createClassData
);

router.get("/", getClassData);

router.put(               // ✅ ADD THIS
  "/:id",
  upload.single("image"),
  convertToWebp,
  updateClassData
);

router.delete("/:id", deleteClassData);

module.exports = router;