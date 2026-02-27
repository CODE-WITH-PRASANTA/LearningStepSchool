const Blog = require("../models/blog.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE ================= */
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      data: blog,
    });

  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL (SEARCH + PAGINATION + FILTER) ================= */
exports.getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = "",
      category,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      data: blogs,
    });

  } catch (err) {
    console.error("GET BLOGS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET SINGLE ================= */
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      data: blog,
    });

  } catch (err) {
    console.error("GET SINGLE BLOG ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { image } = req.body;

    // 🔥 Replace image if new uploaded
    if (image) {
      deleteImageFile(blog.image); // delete old image
      blog.image = image;
    }

    // 🔥 Safe update for other fields
    Object.keys(req.body).forEach((key) => {
      if (key !== "image" && req.body[key] !== undefined) {
        blog[key] = req.body[key];
      }
    });

    await blog.save();

    res.json({
      success: true,
      data: blog,
    });

  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // 🔥 Delete image safely
    deleteImageFile(blog.image);

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};