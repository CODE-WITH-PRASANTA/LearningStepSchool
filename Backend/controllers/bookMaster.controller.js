const Author = require("../models/Library/Author");
const Publication = require("../models/Library/Publication");
const BookCategory = require("../models/Library/BookCategory");
const Fine = require("../models/Library/Fine");

/* ================= AUTHOR ================= */

exports.createAuthor = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Author name is required" });
    }

    const author = await Author.create({ name });

    res.status(201).json({
      message: "Author created successfully",
      data: author,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create author" });
  }
};

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Authors fetched successfully",
      data: authors,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch authors" });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    await Author.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete author" });
  }
};

/* ================= PUBLICATION ================= */

exports.createPublication = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Publication name is required" });
    }

    const publication = await Publication.create({ name });

    res.status(201).json({
      message: "Publication created successfully",
      data: publication,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create publication" });
  }
};

exports.getPublications = async (req, res) => {
  try {
    const publications = await Publication.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Publications fetched successfully",
      data: publications,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch publications" });
  }
};

exports.deletePublication = async (req, res) => {
  try {
    await Publication.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete publication" });
  }
};

/* ================= CATEGORY ================= */

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await BookCategory.create({ name });

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create category" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await BookCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await BookCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};

/* ================= FINE ================= */

exports.createFine = async (req, res) => {
  try {
    const { amount, duration, gst } = req.body;

    if (!amount || !duration) {
      return res.status(400).json({
        message: "Fine amount and duration are required",
      });
    }

    const fine = await Fine.create({
      amount,
      duration,
      gst: gst || 0,
    });

    res.status(201).json({
      message: "Fine created successfully",
      data: fine,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create fine" });
  }
};

exports.getFines = async (req, res) => {
  try {
    const fines = await Fine.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Fines fetched successfully",
      data: fines,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch fines" });
  }
};

exports.deleteFine = async (req, res) => {
  try {
    await Fine.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Fine deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete fine" });
  }
};