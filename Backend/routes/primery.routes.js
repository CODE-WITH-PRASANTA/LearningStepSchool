const express = require("express");
const router = express.Router();

const {
  createActivity,
  getActivities,
  getSingleActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/primery.controller");

router.post("/", createActivity);
router.get("/", getActivities);
router.get("/:id", getSingleActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

module.exports = router;