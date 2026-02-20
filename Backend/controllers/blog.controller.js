const Blog = require("../models/blog.model");
const fs = require("fs");

/* ================= CREATE ================= */
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL (SEARCH + PAGINATION + FILTER) ================= */
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "", category } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: blogs,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET SINGLE ================= */
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, data: blog });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Blog not found" });
    }

    /* DELETE OLD IMAGE */
    if (req.body.image && existing.image) {
      if (fs.existsSync(existing.image)) {
        fs.unlinkSync(existing.image);
      }
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    /* DELETE IMAGE FILE */
    if (blog.image && fs.existsSync(blog.image)) {
      fs.unlinkSync(blog.image);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Blog deleted successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};