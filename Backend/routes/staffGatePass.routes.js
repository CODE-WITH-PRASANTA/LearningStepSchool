const express = require("express");
const router = express.Router();

const {
  createStaffGatePass,
  getStaffGatePasses,
  getStaffGatePassById,
  updateStaffGatePass,
  deleteStaffGatePass,
} = require("../controllers/staffGatePass.controller");

router.post("/create", createStaffGatePass);
router.get("/all", getStaffGatePasses);
router.get("/:id", getStaffGatePassById);
router.put("/update/:id", updateStaffGatePass);
router.delete("/delete/:id", deleteStaffGatePass);

module.exports = router;
