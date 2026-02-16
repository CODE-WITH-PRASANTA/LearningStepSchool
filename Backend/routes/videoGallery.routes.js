const express = require("express");
const router = express.Router();

const {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoGallery.controller");

router.post("/", createVideo);
router.get("/", getVideos);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;