const express = require("express");
const router = express.Router();

const {
  createSystemSetting,
  getSystemSetting,
  updateSystemSetting,
  deleteSystemSetting,
 } = require("../controllers/vehicle/systemSetting.controller");

router.post("/", createSystemSetting);

router.get("/", getSystemSetting);

router.put("/:id", updateSystemSetting);

router.delete("/:id", deleteSystemSetting);

module.exports = router;