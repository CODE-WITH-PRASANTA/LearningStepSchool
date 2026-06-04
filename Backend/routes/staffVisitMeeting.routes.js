const express = require("express");

const router = express.Router();

const controller = require(
  "../controllers/staffVisitMeeting.controller"
);

router.post(
  "/create",
  controller.createVisit
);

router.get(
  "/all",
  controller.getAllVisits
);

router.get(
  "/:id",
  controller.getVisitById
);

router.put(
  "/update/:id",
  controller.updateVisit
);

router.delete(
  "/delete/:id",
  controller.deleteVisit
);

module.exports = router;