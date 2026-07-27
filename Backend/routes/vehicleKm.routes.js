const express = require("express");
const router = express.Router();

const {
  createVehicleKm,
  getVehicleKm,
  updateVehicleKm,
  deleteVehicleKm,
} = require("../controllers/vehicle/vehicleKm.controller");

router.post("/", createVehicleKm);

router.get("/", getVehicleKm);

router.put("/:id", updateVehicleKm);

router.delete("/:id", deleteVehicleKm);

module.exports = router;