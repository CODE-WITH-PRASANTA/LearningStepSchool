const express = require("express");
const router = express.Router();

const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject
} = require("../controllers/subject.controller");

const { upload, convertToWebp } = require("../middleware/upload");


/* CREATE SUBJECT */

router.post(
  "/subjects",
  upload.single("image"),
  convertToWebp,
  createSubject
);


/* GET SUBJECTS */

router.get("/subjects", getSubjects);


/* UPDATE SUBJECT */

router.put(
  "/subjects/:id",
  upload.single("image"),
  convertToWebp,
  updateSubject
);


/* DELETE SUBJECT */

router.delete("/subjects/:id", deleteSubject);


module.exports = router;