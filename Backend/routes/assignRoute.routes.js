const express = require("express");

const router = express.Router();

const controller = require("../controllers/vehicle/assignRoute.controller");

router.post(
  "/create",
  controller.createAssignRoute
);

router.get(
  "/",
  controller.getAssignRoutes
);

router.put(
  "/:id",
  controller.updateAssignRoute
);

router.delete(
  "/:id",
  controller.deleteAssignRoute
);

module.exports = router;
