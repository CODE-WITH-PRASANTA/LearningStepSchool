const express = require("express");

const router = express.Router();

const {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
} = require("../../controllers/Fee/feeStructure.controller");

router.post("/create", createFeeStructure);

router.get("/all", getAllFeeStructures);

router.get("/:id", getFeeStructureById);

router.put("/update/:id", updateFeeStructure);

router.delete("/delete/:id", deleteFeeStructure);

module.exports = router;