const express = require("express");
const router = express.Router();

const {
  collectFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee
} = require("../controllers/admissionfee.controller");

/* ================= COLLECT FEE ================= */
router.post("/fees", collectFee);

/* ================= GET ALL FEES ================= */
router.get("/fees", getFees);

/* ================= GET SINGLE FEE ================= */
router.get("/fees/:id", getFeeById);

/* ================= UPDATE FEE ================= */
router.put("/fees/:id", updateFee);

/* ================= DELETE FEE ================= */
router.delete("/fees/:id", deleteFee);

module.exports = router;