const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

/* =========================================================
   HELPERS
========================================================= */

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
};

/* =========================================================
   ROUTE → FOLDER MAP
========================================================= */

const routeFolderMap = {
  "/advertisements": "uploads/advertisements",
  "/blogs": "uploads/blogs",
  "/class-data": "uploads/class-data",
  "/classes": "uploads/classes",
  "/gallery": "uploads/gallery",
  "/notices": "uploads/notices",
  "/students": "uploads/students",
  "/subjects": "uploads/subjects",
  "/teachers": "uploads/teachers",
  "/testimonials": "uploads/testimonials",
  "/tickets": "uploads/tickets",
  "/popup": "uploads/popup",
  "/pre-admission": "uploads/pre-admission",
  "/student-gatepass": "uploads/student-gatepass",
  "/fuel": "uploads/fuel",


   "/auth": "uploads/admin",
  
  "/student-leave": "uploads/student-leave",
  "/expense-management": "uploads/expense-management",
  "/expenses": "uploads/add-expense",
};

/* =========================================================
   GET UPLOAD PATH
========================================================= */

const getUploadPath = (req) => {
  let uploadPath = "uploads/common";

  const url = req.originalUrl || "";

  /*
   * Example:
   *
   * /api/expenses
   *
   * will match:
   *
   * /expenses
   *
   * and save to:
   *
   * uploads/add-expense
   */

  for (const route in routeFolderMap) {
    if (url.includes(route)) {
      uploadPath = routeFolderMap[route];
      break;
    }
  }

  ensureDir(uploadPath);

  console.log("======================================");

  console.log("UPLOAD REQUEST URL:", url);

  console.log("UPLOAD FOLDER:", uploadPath);

  console.log("======================================");

  return uploadPath;
};

/* =========================================================
   MULTER CONFIG
========================================================= */

const storage = multer.memoryStorage();

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  const route = req.originalUrl || "";

  const mime = file.mimetype || "";

  const isImage = mime.startsWith("image/");

  const isPDF = mime === "application/pdf";

  const isDOC =
    mime === "application/msword" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  /* =======================================================
     ADD EXPENSE BILL VALIDATION
  ======================================================= */

  if (route.includes("/expenses")) {
    /*
     * Add Expense only accepts:
     *
     * bill
     *
     * PDF
     * JPG
     * JPEG
     * PNG
     * WEBP
     */

    if (file.fieldname === "bill") {
      if (isImage || isPDF) {
        return cb(null, true);
      }

      return cb(new Error("Bill must be a PDF or image file"));
    }
  }

  /* =======================================================
     EXISTING STUDENT VALIDATION
  ======================================================= */

  if (route.includes("/students")) {
    const field = file.fieldname;

    const imageFields = [
      "studentPhoto",
      "fatherPhoto",
      "motherPhoto",
      "guardianPhoto",
    ];

    const pdfFields = [
      "reportCard",
      "tc",
      "samagraId",
      "nidaCard",
      "previousMarksheet",
      "dobCertificate",
      "incomeCertificate",
      "pip",
    ];

    const pdfOrImageFields = ["aadhaarStudent", "aadhaarParent"];

    if (imageFields.includes(field)) {
      return isImage
        ? cb(null, true)
        : cb(new Error(`${field} must be an image`));
    }

    if (pdfFields.includes(field)) {
      return isPDF ? cb(null, true) : cb(new Error(`${field} must be a PDF`));
    }

    if (pdfOrImageFields.includes(field)) {
      return isPDF || isImage
        ? cb(null, true)
        : cb(new Error(`${field} must be PDF or image`));
    }
  }

  /* =======================================================
     DEFAULT VALIDATION
  ======================================================= */

  if (isImage || isPDF || isDOC) {
    return cb(null, true);
  }

  return cb(new Error("Only images, PDF, DOC, DOCX files are allowed"));
};

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* =========================================================
   FILE PROCESSOR
========================================================= */

const processFile = async (file, uploadPath) => {
  const isImage = file.mimetype.startsWith("image/");

  /* =======================================================
     IMAGE
     Convert → WEBP
  ======================================================= */

  if (isImage) {
    const filename = `${file.fieldname}_${Date.now()}.webp`;

    const outputPath = path.join(uploadPath, filename);

    await sharp(file.buffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
      })
      .toFile(outputPath);

    return "/" + outputPath.replace(/\\/g, "/");
  }

  /* =======================================================
     PDF / DOC / DOCX
     Save directly
  ======================================================= */

  const ext = path.extname(file.originalname).toLowerCase();

  const filename = `${file.fieldname}_${Date.now()}${ext}`;

  const outputPath = path.join(uploadPath, filename);

  fs.writeFileSync(outputPath, file.buffer);

  return "/" + outputPath.replace(/\\/g, "/");
};

/* =========================================================
   FILE PROCESSOR MIDDLEWARE
========================================================= */

const convertToWebp = async (req, res, next) => {
  try {
    /*
     * No file uploaded
     */

    if (!req.file && !req.files) {
      return next();
    }

    const uploadPath = getUploadPath(req);

    /* =====================================================
       SINGLE FILE
    ===================================================== */

    if (req.file) {
      const pathSaved = await processFile(req.file, uploadPath);

      req.file.path = pathSaved;

      /*
       * For bill:
       *
       * req.body.bill =
       * /uploads/add-expense/bill_xxx.pdf
       */

      req.body[req.file.fieldname] = pathSaved;

      console.log("SAVED FILE:", pathSaved);
    }

    /* =====================================================
       MULTIPLE FILES
    ===================================================== */

    if (req.files) {
      for (const field in req.files) {
        req.body[field] = [];

        for (const file of req.files[field]) {
          const pathSaved = await processFile(file, uploadPath);

          file.path = pathSaved;

          req.body[field].push(pathSaved);

          console.log("SAVED FILE:", pathSaved);
        }
      }
    }

    next();
  } catch (err) {
    console.error("🔥 UPLOAD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }
};

/* =========================================================
   DELETE UPLOADED FILE
========================================================= */

const deleteImageFile = (imagePath) => {
  try {
    if (!imagePath) {
      return;
    }

    /*
     * Remove leading slash
     *
     * /uploads/add-expense/file.pdf
     *
     * →
     *
     * uploads/add-expense/file.pdf
     */

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;

    const fullPath = path.join(__dirname, "..", cleanPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      console.log("⚠️ FILE NOT FOUND:", fullPath);
    }
  } catch (err) {
    console.error("🔥 DELETE ERROR:", err);
  }
};

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  upload,
  convertToWebp,
  deleteImageFile,
};
