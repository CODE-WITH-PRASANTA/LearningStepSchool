const express = require("express");
const router = express.Router();

const {
  createPhoto,
  getPhotos,
  updatePhoto,
  deletePhoto,
} = require("../controllers/photoGallery.controller");

const { upload, convertToWebp } = require("../middleware/upload");

/* ================= ROUTES ================= */

router.post(
  "/",
  upload.single("image"),
  convertToWebp,
  createPhoto
);

router.get("/", getPhotos);

router.put(
  "/:id",
  upload.single("image"),
  convertToWebp,
  updatePhoto
);

router.delete("/:id", deletePhoto);

module.exports = router;