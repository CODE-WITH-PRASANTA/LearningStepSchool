const express = require("express");
const router = express.Router();

const {
  createFeeGroup,
  getAllFeeGroups,
  getFeeGroupById,
  updateFeeGroup,
  deleteFeeGroup,
} = require("../../controllers/Fee/feeGroup.controller");

router.post("/create", createFeeGroup);

router.get("/all", getAllFeeGroups);

router.get("/:id", getFeeGroupById);

router.put("/update/:id", updateFeeGroup);

router.delete("/delete/:id", deleteFeeGroup);

module.exports = router;