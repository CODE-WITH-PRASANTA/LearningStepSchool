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
const examType = require("./routes/examType.routes");
const authRoutes = require("./routes/adminAuth.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const studentLeaveRoutes = require("./routes/studentLeave.routes");
const expenseHeadRoutes = require("./routes/expenseHead.routes");
const expenseRoutes = require("./routes/expense.routes");

/// TEACHER CREATE ROUTE
const teacherCreateRoutes = require("./routes/teacherRoutes/createteacher.routes");
const permissionRoutes = require("./routes/teacherRoutes/permission.routes");
const teacherAuthRoutes = require("./routes/teacherRoutes/teacherAuth.routes");
const leaveRoutes = require("./routes/teacherRoutes/teacherLeave.routes");

const walletRoutes = require("./routes/wallet.routes");
const payrollRoutes = require("./routes/payroll.routes");
const teacherAttendanceRoutes = require("./routes/teacherAttendance.routes");

const bookMasterRoutes = require("./routes/bookMaster.routes");
const bookRoutes = require("./routes/book.routes");
const issueBookRoutes = require("./routes/issueBook.routes");
const returnBook = require("./routes/returnbook.routes");
const damageBookRoutes = require("./routes/damageBook.routes");
const ticketRoutes = require("./routes/ticket.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const routeRoutes = require("./routes/route.routes");
const destinationRoutes = require("./routes/destination.routes");
const assignRouteRoutes = require("./routes/assignRoute.routes");
const vehicleRouteRoutes = require("./routes/vehicleRoute.routes");
const otherIncomeRoutes = require("./routes/otherIncome.routes");
const popupRoutes = require("./routes/popup.routes");
const staffGatePassRoutes = require("./routes/staffGatePass.routes");
const preAdmissionRoutes = require("./routes/preAdmission.routes");
const staffVisitMeetingRoutes = require("./routes/staffVisitMeeting.routes");
const adminComplaintRoutes = require("./routes/adminComplaint.routes");
const staffComplaintRoutes = require("./routes/staffComplaint.routes");
const studentGatePassRoutes = require("./routes/studentGatePass.routes");

const feeGroupRoutes = require("./routes/Fee/feeGroup.routes");
const feeHeadRoutes = require("./routes/Fee/feeHead.routes");
const feeStructureRoutes = require("./routes/Fee/feeStructure.routes");
const feeEntryRoutes = require("./routes/Fee/feeEntry.routes");





app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/notifications", notificationRoutes);
app.use("/api/latest-news", latestNewsRoutes);
app.use("/api/photo-gallery", photoGalleryRoutes);
app.use("/api/video-gallery", videoGalleryRoutes);
// app.use("/api/teachers", teacherRoutes);
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

// ERP routes

// student admission
app.use("/api/students", studentAdmissionRoutes);
app.use("/api/classes", classRoutes);
app.use("/api", subjectRoutes);

app.use("/api/advertisements", advertisementRoutes);
// fees
app.use("/api/feetypes", feeTypes);
app.use("/api/admission", AdmsonfeeRoutes);
app.use("/api/other-income", otherIncomeRoutes);
// classwise subjects
app.use("/api/classwise-subjects", classWiseSubjectRoutes);
// exam
app.use("/api/exam-types", examType);
app.use("/api/exam-results", examResult);
// auth and attendance
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/student-leave", studentLeaveRoutes);

// expenses
app.use("/api/expense-heads", expenseHeadRoutes);
app.use("/api/expenses", expenseRoutes);
// teacher routes
app.use("/api/admin", teacherCreateRoutes);
app.use("/api/teacher", teacherAuthRoutes);
app.use("/api", permissionRoutes);
app.use("/api/teacher-attendance", teacherAttendanceRoutes);
app.use("/api", leaveRoutes);
// salary and payroll
app.use("/api/wallet", walletRoutes);
app.use("/api/payroll", payrollRoutes);

// library
app.use("/api/book-master", bookMasterRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/issue-books", issueBookRoutes);
app.use("/api/return-books", returnBook);
app.use("/api/damage-books", damageBookRoutes);

// Support
app.use("/api/ticket", ticketRoutes);

// Transport
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/transport-route", routeRoutes);
app.use("/api/transport-destination", destinationRoutes);
app.use("/api/assign-route", assignRouteRoutes);
app.use("/api/vehicle-route", vehicleRouteRoutes);

// Font office
app.use("/api/popup", popupRoutes);
app.use("/api/staff-gate-pass", staffGatePassRoutes);
app.use("/api/pre-admission", preAdmissionRoutes);
app.use("/api/staff-visit-meeting", staffVisitMeetingRoutes);
app.use("/api/admin-complaint", adminComplaintRoutes);
app.use("/api/staff-complaint", staffComplaintRoutes);
app.use("/api/student-gatepass", studentGatePassRoutes);

// new fees

app.use("/api/fee-group", feeGroupRoutes);
app.use("/api/fee-head", feeHeadRoutes);
app.use("/api/fee-structure", feeStructureRoutes);
app.use("/api/fee-entry", feeEntryRoutes);





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
