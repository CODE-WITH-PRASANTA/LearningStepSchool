const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* ================= CONNECT DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
  })
);

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("API Working");
});

// IMPORT ROUTES AFTER APP IS CREATED
const surveyRoutes = require("./routes/admissionSurvey.routes");
const notificationRoutes = require("./routes/notification.routes");
const latestNewsRoutes = require("./routes/latestNews.routes");
const photoGalleryRoutes = require("./routes/photoGallery.routes");
const videoGalleryRoutes = require("./routes/videoGallery.routes");
const teacherRoutes = require("./routes/teacher.routes");
const noticeRoutes = require("./routes/notice.routes");
const awardRoutes = require("./routes/award.routes");


app.use("/uploads", express.static("uploads"));

app.use("/api/survey", surveyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/latest-news", latestNewsRoutes);
app.use("/api/photo-gallery", photoGalleryRoutes);
app.use("/api/video-gallery", videoGalleryRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/awards", awardRoutes);


/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
