const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getWalletHistory,
  getWalletSummary,
  getMonthlyReport,
  getTransactionById,
} = require("../controllers/wallet.controller");

/* ================= WALLET ================= */
router.post("/", createTransaction);
router.get("/history", getWalletHistory);
router.get("/summary", getWalletSummary);
router.get("/monthly", getMonthlyReport);
router.get("/:id", getTransactionById);

module.exports = router;