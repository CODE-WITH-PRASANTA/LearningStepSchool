const express = require("express");
const router = express.Router();

const {
  createAuthor,
  getAuthors,
  deleteAuthor,

  createPublication,
  getPublications,
  deletePublication,

  createCategory,
  getCategories,
  deleteCategory,

  createFine,
  getFines,
  deleteFine,
} = require("../controllers/bookMaster.controller");

/* AUTHOR */
router.post("/authors", createAuthor);
router.get("/authors", getAuthors);
router.delete("/authors/:id", deleteAuthor);

/* PUBLICATION */
router.post("/publications", createPublication);
router.get("/publications", getPublications);
router.delete("/publications/:id", deletePublication);

/* CATEGORY */
router.post("/book-categories", createCategory);
router.get("/book-categories", getCategories);
router.delete("/book-categories/:id", deleteCategory);

/* FINE */
router.post("/fines", createFine);
router.get("/fines", getFines);
router.delete("/fines/:id", deleteFine);

module.exports = router;