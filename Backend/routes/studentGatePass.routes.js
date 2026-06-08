const express = require("express");
const router = express.Router();

const controller = require(
  "../controllers/studentGatePass.controller"
);

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

/* CREATE */

router.post(
  "/create",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  convertToWebp,
  controller.createGatePass
);

/* GET ALL */

router.get(
  "/all",
  controller.getAllGatePasses
);

/* GET SINGLE */

router.get(
  "/:id",
  controller.getGatePassById
);

/* UPDATE */

router.put(
  "/update/:id",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  convertToWebp,
  controller.updateGatePass
);

/* DELETE */

router.delete(
  "/delete/:id",
  controller.deleteGatePass
);

/* STUDENT WISE */

router.get(
  "/student/:studentId",
  controller.getStudentGatePasses
);

module.exports = router;