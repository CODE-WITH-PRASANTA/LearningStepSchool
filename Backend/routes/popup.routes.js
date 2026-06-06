const express = require("express");
const router = express.Router();

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

const {
  createPopup,
  getAllPopup,
  getPopupById,
  updatePopup,
  deletePopup,
} = require("../controllers/popup.controller");

router.post(
  "/create",
  upload.single("image"),
  convertToWebp,
  createPopup
);

router.get(
  "/all",
  getAllPopup
);

router.get(
  "/:id",
  getPopupById
);

router.put(
  "/update/:id",
  upload.single("image"),
  convertToWebp,
  updatePopup
);

router.delete(
  "/delete/:id",
  deletePopup
);

module.exports = router;