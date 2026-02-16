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
    origin: "*",
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

app.use("/api/survey", surveyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/latest-news", latestNewsRoutes);


/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
