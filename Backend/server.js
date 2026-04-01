const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
const app = express();
/* ================= CONNECT DATABASE ================= */
connectDB();
/* ================= MIDDLEWARE ================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("API Working");
});
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
const studentAdmissionRoutes = require("./routes/studentAdmission.routes");
const advertisementRoutes = require("./routes/advertisement.routes");
const classRoutes = require("./routes/class.routes");
const subjectRoutes = require("./routes/subject.routes");
const AdmsonfeeRoutes = require("./routes/admissionfee.routes");
const feeTypes = require("./routes/feeType.routes");
const classWiseSubjectRoutes = require("./routes/classWiseSubject.routes");
const examResult = require("./routes/examResult.routes");
const examType = require("./routes/examType.routes")
const authRoutes = require("./routes/adminAuth.routes");
const attendanceRoutes = require("./routes/attendance.routes");


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/students", studentAdmissionRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api", classRoutes);
app.use("/api", subjectRoutes);
app.use("/api/admission", AdmsonfeeRoutes);
app.use("/api/feetypes", feeTypes);
app.use("/api/classwise-subjects", classWiseSubjectRoutes);
app.use("/api/exam-results", examResult);
app.use("/api/exam-types",examType );
app.use("/api/auth", authRoutes);
app.use("/api", attendanceRoutes);


/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    url: req.originalUrl,
  });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});












 


 



