const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const companyRoutes = require("./routes/companyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

connectDB();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "Too many attempts. Please try again later." },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "HireTrail API is running", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
