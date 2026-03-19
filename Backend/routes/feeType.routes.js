const express = require("express");
const router = express.Router();

const controller = require("../controllers/feeType.controller");

router.get("/", controller.getFeeTypes);
router.post("/", controller.createFeeType);
router.put("/:id", controller.updateFeeType);
router.delete("/:id", controller.deleteFeeType);

module.exports = router;