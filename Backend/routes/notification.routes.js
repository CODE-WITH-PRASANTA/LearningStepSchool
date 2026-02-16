const express = require("express");
const router = express.Router();

const {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  togglePublishNotification,
} = require("../controllers/notification.controller");

router.get("/test", (req, res) => {
  res.send("Notification route working");
});

router.post("/", createNotification);
router.get("/", getAllNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);
router.patch("/toggle/:id", togglePublishNotification);

module.exports = router;
