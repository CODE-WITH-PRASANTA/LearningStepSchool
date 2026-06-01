const express = require("express");

const router = express.Router();

const controller = require("../controllers/vehicle/vehicleRoute.controller");

router.post(
  "/create",
  controller.createVehicleRoute
);

router.get(
  "/",
  controller.getVehicleRoutes
);

router.put(
  "/:id",
  controller.updateVehicleRoute
);

router.delete(
  "/:id",
  controller.deleteVehicleRoute
);

module.exports = router;
