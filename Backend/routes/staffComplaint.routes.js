const express = require("express");

const router = express.Router();

const controller = require(
  "../controllers/staffComplaint.controller"
);

router.post(
  "/create",
  controller.createComplaint
);

router.get(
  "/all",
  controller.getAllComplaints
);

router.get(
  "/:id",
  controller.getComplaintById
);

router.put(
  "/update/:id",
  controller.updateComplaint
);

router.delete(
  "/delete/:id",
  controller.deleteComplaint
);


router.post(
  "/type/create",
  controller.addComplaintType
);

router.get(
  "/type/all",
  controller.getComplaintTypes
);

router.put(
  "/type/update",
  controller.updateComplaintType
);

router.delete(
  "/type/delete/:type",
  controller.deleteComplaintType
);

module.exports = router;