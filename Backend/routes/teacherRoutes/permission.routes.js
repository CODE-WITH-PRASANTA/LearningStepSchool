const express = require("express");
const router = express.Router();

const {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission
} = require("../../controllers/teacherController/permission.controller");

const auth = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission");

// CREATE
router.post("/permissions", auth, createPermission);

// GET ALL
router.get("/permissions", auth, getPermissions);

// UPDATE
router.put("/permissions/:id", auth, updatePermission);

// DELETE
router.delete("/permissions/:id", auth, deletePermission);

module.exports = router;