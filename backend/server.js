const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");

// Use routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    // Replace with your MongoDB connection string
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/placement_portal";
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Placement Portal API is running");
});

// For debugging mongoose
mongoose.set("debug", process.env.NODE_ENV === "development");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
