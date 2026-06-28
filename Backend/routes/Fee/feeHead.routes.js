const express = require("express");
const router = express.Router();

const {
  createFeeHead,
  getAllFeeHeads,
  getFeeHeadById,
  updateFeeHead,
  deleteFeeHead,
} = require("../../controllers/Fee/feeHead.controller");

router.post("/create", createFeeHead);

router.get("/all", getAllFeeHeads);

router.get("/:id", getFeeHeadById);

router.put("/update/:id", updateFeeHead);

router.delete("/delete/:id", deleteFeeHead);

module.exports = router;