const express = require("express");
const router = express.Router();

const {
  createIncome,
  getAllIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
  monthlyIncomeReport,
  yearlyIncomeReport,
} = require("../controllers/otherIncome.controller");

router.post("/create", createIncome);

router.get("/all", getAllIncome);

router.get(
  "/report/monthly",
  monthlyIncomeReport
);

router.get(
  "/report/yearly",
  yearlyIncomeReport
);

router.get("/:id", getIncomeById);

router.put("/update/:id", updateIncome);

router.delete("/delete/:id", deleteIncome);

module.exports = router;
