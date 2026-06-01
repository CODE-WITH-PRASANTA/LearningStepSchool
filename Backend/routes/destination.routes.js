const express = require("express");

const router =
  express.Router();

const controller = require(
  "../controllers/vehicle/destination.controller"
);

router.post(
  "/create",
  controller.createDestination
);

router.get(
  "/",
  controller.getDestinations
);

router.put(
  "/:id",
  controller.updateDestination
);

router.delete(
  "/:id",
  controller.deleteDestination
);

module.exports = router;