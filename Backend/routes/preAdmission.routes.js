const express = require("express");

const router = express.Router();

const { upload, convertToWebp } = require("./../middleware/upload");

const controller = require("./../controllers/preAdmission.controler");

router.post(
  "/create",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  convertToWebp,
  controller.createPreAdmission,
);

router.get("/all", controller.getAllPreAdmissions);

router.get("/:id", controller.getPreAdmissionById);

router.put(
  "/update/:id",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  convertToWebp,
  controller.updatePreAdmission,
);

router.delete("/delete/:id", controller.deletePreAdmission);

module.exports = router;
