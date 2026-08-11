const express = require("express");

const {
  createFuel,
  getAllFuel,
  getFuelById,
  updateFuel,
  deleteFuel,
  getFuelSummary,
} = require("../controllers/fuelController");

const router = express.Router();


// =====================================================
// FUEL ROUTES
// =====================================================

// Create
router.post("/", createFuel);


// Get all + search + pagination
router.get("/", getAllFuel);


// Summary
router.get("/summary", getFuelSummary);


// Get single
router.get("/:id", getFuelById);


// Update
router.put("/:id", updateFuel);


// Delete
router.delete("/:id", deleteFuel);


module.exports = router;