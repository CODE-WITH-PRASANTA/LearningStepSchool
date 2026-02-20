const express = require("express");
const router = express.Router();

const { upload, convertToWebp } = require("../middleware/upload");

const {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller");

/* CREATE */
router.post(
  "/",
  upload.single("image"),
  convertToWebp,
  createBlog
);

/* GET ALL */
router.get("/", getBlogs);

/* GET SINGLE */
router.get("/:id", getSingleBlog);

/* UPDATE */
router.put(
  "/:id",
  upload.single("image"),
  convertToWebp,
  updateBlog
);

/* DELETE */
router.delete("/:id", deleteBlog);

module.exports = router;