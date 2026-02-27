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

app.use(cors());
/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("API Working");
});

// IMPORT ROUTES AFTER APP IS CREATED
// const surveyRoutes = require("./routes/admissionSurvey.routes");
const notificationRoutes = require("./routes/notification.routes");
const latestNewsRoutes = require("./routes/latestNews.routes");
const photoGalleryRoutes = require("./routes/photoGallery.routes");
const videoGalleryRoutes = require("./routes/videoGallery.routes");
const teacherRoutes = require("./routes/teacher.routes");
const noticeRoutes = require("./routes/notice.routes");
const awardRoutes = require("./routes/award.routes");
const prePrimaryRoutes = require("./routes/preprimary.routes");
const primeryRoutes = require("./routes/primery.routes");
const secondaryRoutes = require("./routes/secondary.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const faqRoutes = require("./routes/faq.routes");
const surveyRoutes = require("./routes/survey.routes");
const blogRoutes = require("./routes/blog.routes");
const feeRoutes = require("./routes/fee.routes");
const classDataRoutes = require("./routes/classData.routes");
const eventRoutes = require("./routes/event.routes");

const enquiryRoutes = require("./routes/enquiry.routes");

app.use("/uploads", express.static("uploads"));


app.use("/api/notifications", notificationRoutes);
app.use("/api/latest-news", latestNewsRoutes);
app.use("/api/photo-gallery", photoGalleryRoutes);
app.use("/api/video-gallery", videoGalleryRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/preprimary", prePrimaryRoutes);
app.use("/api/primery", primeryRoutes);
app.use("/api/secondary", secondaryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/class-data", classDataRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/enquiries", enquiryRoutes);












/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
