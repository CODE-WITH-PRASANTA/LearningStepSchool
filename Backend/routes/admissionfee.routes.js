const express = require("express");
const router = express.Router();

const {
  collectFee,
  getFees,
  deleteFee
} = require("../controllers/admissionfee.controller");


/* ================= COLLECT FEE ================= */

router.post("/fees", collectFee);


/* ================= GET FEES ================= */

router.get("/fees", getFees);


/* ================= DELETE FEE ================= */

router.delete("/fees/:id", deleteFee);


module.exports = router;