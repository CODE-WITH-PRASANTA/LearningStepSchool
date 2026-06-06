const express = require("express");
const router = express.Router();

const controller = require(
  "../controllers/adminComplaint.controller"
);

router.post("/create", controller.createComplaint);

router.get("/all", controller.getAllComplaints);

router.get("/:id", controller.getComplaintById);

router.put(
  "/update/:id",
  controller.updateComplaint
);

router.delete(
  "/delete/:id",
  controller.deleteComplaint
);

module.exports = router;