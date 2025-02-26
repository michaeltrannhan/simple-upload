// server.js - Main entry point for the Express application

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

// Import routes
const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/file.routes");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";
  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
