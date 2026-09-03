const express = require("express");

const {
  createFuel,
  getAllFuel,
  getFuelById,
  updateFuel,
  deleteFuel,
  getFuelSummary,
} = require("../controllers/fuelController");

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

const router =
  express.Router();

// =====================================================
// FUEL ROUTES
// =====================================================

// Create Fuel + Fuel Bill
router.post(
  "/",
  upload.single("fuelBill"),
  convertToWebp,
  createFuel
);

// Get all + search + pagination + filters
router.get(
  "/",
  getAllFuel
);

// Summary
router.get(
  "/summary",
  getFuelSummary
);

// Get single
router.get(
  "/:id",
  getFuelById
);

// Update + optional Fuel Bill
router.put(
  "/:id",
  upload.single("fuelBill"),
  convertToWebp,
  updateFuel
);

// Delete
router.delete(
  "/:id",
  deleteFuel
);

module.exports = router;