const express = require("express");
const router = express.Router();

const {
  createAdvertisement,
  getAdvertisements,
  deleteAdvertisement,
  toggleAdvertisement,
} = require("../controllers/advertisement.controller");

const { upload, convertToWebp } = require("../middleware/upload");

/* ================= CREATE ================= */

router.post(
  "/create",
  upload.single("image"),
  convertToWebp,
  createAdvertisement
);


/* ================= GET ALL ================= */

router.get("/all", getAdvertisements);


/* ================= TOGGLE ACTIVE ================= */

router.put("/toggle/:id", toggleAdvertisement);


/* ================= DELETE ================= */

router.delete("/delete/:id", deleteAdvertisement);

module.exports = router;