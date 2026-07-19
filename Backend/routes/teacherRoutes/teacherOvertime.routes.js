const express = require("express");

const router = express.Router();

const {
  createOvertime,
  getMyOvertimes,
  getOvertimeById,
  updateOvertime,
  deleteOvertime,
  getAllOvertimes,
  updateOvertimeStatus,
} = require(
  "../../controllers/teacherController/TeacherOvertime.controller"
);

const auth = require("../../middleware/authMiddleware");

/* ================= TEACHER ================= */

router.post(
  "/teacher/overtimes",
  auth,
  createOvertime
);

router.get(
  "/teacher/overtimes",
  auth,
  getMyOvertimes
);

router.get(
  "/teacher/overtimes/:id",
  auth,
  getOvertimeById
);

router.put(
  "/teacher/overtimes/:id",
  auth,
  updateOvertime
);

router.delete(
  "/teacher/overtimes/:id",
  auth,
  deleteOvertime
);

/* ================= ADMIN ================= */

router.get(
  "/admin/overtimes",
  auth,
  getAllOvertimes
);

router.put(
  "/admin/overtimes/:id/status",
  auth,
  updateOvertimeStatus
);

module.exports = router;