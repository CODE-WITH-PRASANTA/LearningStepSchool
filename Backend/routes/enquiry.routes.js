const express = require("express");
const router = express.Router();
const enquiryController = require("../controllers/enquiry.controller");

/* PUBLIC ROUTE */
router.post("/", enquiryController.createEnquiry);

/* ADMIN ROUTES */
router.get("/", enquiryController.getEnquiries);
router.delete("/:id", enquiryController.deleteEnquiry);
router.put("/:id/status", enquiryController.updateStatus);

// ✅ NEW ROUTE
router.put("/:id/feedback", enquiryController.updateFeedback);

module.exports = router;