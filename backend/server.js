const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

// Load environment variables
dotenv.config();

const app = express();

// Middleware Setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true, // Allow cookies & sessions to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));

// Connect to MongoDB
const dbUrl =
  process.env.DB_URL || "mongodb://localhost:27017/placement_portal";
async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}
connectDB();

// Session Store (MongoDB)
const sessionSecret = process.env.SECRET || "your-secret-key";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: sessionSecret },
  touchAfter: 24 * 60 * 60, // Reduce session writes
});

store.on("error", (error) => {
  console.error("❌ Mongo Session Store Error:", error);
});

// Express Session Middleware
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    rolling: true, // Reset expiration on every response
  })
);

app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");
const queryRoutes = require("./routes/queryRoutes");

// Use routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/queries", queryRoutes);

// Middleware to make user info available globally
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

// Default route
app.get("/", (req, res) => {
  res.send("Placement Portal API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
