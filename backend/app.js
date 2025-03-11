if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const studentInfo = require("./model/newStudent");
const adminInfo = require("./model/newAdmin");
const facultyInfo = require("./model/facultySchema");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Load environment variables
const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;
const sessionSecret = process.env.SECRET;

// Middleware Setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000", // Your React frontend URL
  credentials: true, // Allow cookies & sessions to be sent
};
app.use(cors(corsOptions));

// Connect to MongoDB
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
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 Week
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

// **Passport Local Strategy**
passport.use("student", studentInfo.createStrategy());
passport.use("admin", adminInfo.createStrategy());

// Serialize & Deserialize properly for multiple strategies
passport.serializeUser((user, done) => {
  console.log("🔹 Serializing User:", user.username);
  done(null, {
    id: user._id,
    role:
      user._doc.role ||
      (user.collection.name.includes("admin") ? "admin" : "student"),
  });
});

passport.deserializeUser(async (userData, done) => {
  try {
    let user = null;

    if (userData.role === "admin") {
      user = await adminInfo.findById(userData.id);
    } else {
      user = await studentInfo.findById(userData.id);
    }

    if (!user) return done(null, false);
    console.log("🔹 Deserializing User:", user.username);
    done(null, { ...user._doc, role: userData.role });
  } catch (error) {
    done(error);
  }
});

// Middleware to make user available in templates
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

// **Signup Routes**
app.post("/signup-student", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      roll,
      branch,
      username,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await studentInfo.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const newStudent = new studentInfo({
      name,
      email,
      phone,
      roll,
      branch,
      username,
    });

    await studentInfo.register(newStudent, password);
    res
      .status(201)
      .json({ success: true, message: "Student registered successfully" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/signup-admin", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      designation,
      department,
      accessCode,
      username,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await adminInfo.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const facultyUser = await facultyInfo.findOne({ phone });
    if (!facultyUser || facultyUser.accessCode !== accessCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty user or access code",
      });
    }

    const newAdmin = new adminInfo({
      name,
      email,
      phone,
      designation,
      department,
      username,
    });

    await adminInfo.register(newAdmin, password);
    res
      .status(201)
      .json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// **Login Route**
// Fix login route
app.post("/login", (req, res, next) => {
  const { username, password, role } = req.body;
  // console.log("📝 Login attempt details:", { username, role });

  if (!role) {
    // console.log("❌ No role specified in request");
    return res
      .status(400)
      .json({ success: false, message: "Role is required" });
  }

  // Use the pre-defined strategy from passport-local-mongoose
  passport.authenticate(role, (err, user, info) => {
    if (err) {
      console.error("❌ Passport Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (!user) {
      console.log("❌ Authentication failed:", info);
      return res
        .status(400)
        .json({
          success: false,
          message: info.message || "Invalid credentials",
        });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("❌ Login Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Login failed" });
      }

      req.session.user = {
        id: user._id,
        username: user.username,
        role: role,
      };

      // console.log("✅ Session Set:", req.session.user);
      res
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          user: req.session.user,
        });
    });
  })(req, res, next);
});

// Route to get currently logged-in user
app.get("/current-user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "No user logged in" });
  }

  // Send the session user details to frontend
  res.status(200).json({ success: true, user: req.session.user });
});


// **Server Listener**
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
