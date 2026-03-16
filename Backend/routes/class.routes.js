const express = require("express");
const router = express.Router();

const {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} = require("../controllers/class.controller");

const { upload, convertToWebp } = require("../middleware/upload");

/* CREATE CLASS */

router.post(
  "/classes",
  upload.single("image"),
  convertToWebp,
  createClass
);

/* GET CLASSES */

router.get("/classes", getClasses);

/* UPDATE CLASS */

router.put(
  "/classes/:id",
  upload.single("image"),
  convertToWebp,
  updateClass
);

/* DELETE CLASS */

router.delete("/classes/:id", deleteClass);

module.exports = router;