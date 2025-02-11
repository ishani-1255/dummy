if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const studentInfo = require("./model/newStudent");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const port = process.env.PORT;
const dbUrl = process.env.DB_URL;
const mongoose = require("mongoose");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configure session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 60 * 60,
});

// Session options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

store.on("error", (error) => {
  console.error("Error in MONGO SESSION STORE:", error);
});

app.use(session(sessionOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(studentInfo.authenticate()));
passport.serializeUser(studentInfo.serializeUser());
passport.deserializeUser(studentInfo.deserializeUser());

// Middleware to make user data available in templates
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

// Connect to the database
async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

connectDB();

app.post("/signup-student", async (req, res) => {
  try {
    const { name, email, phone, roll, branch, username, password, confirmPassword } = req.body;

    // Password validation
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await studentInfo.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    // Create new student instance
    const newStudent = new studentInfo({
      name,
      email,
      phone,
      roll,
      branch,
      username,
    });

    // Register the user with Passport.js
    await studentInfo.register(newStudent, password);

    res.status(201).json({ success: true, message: "Student registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login Route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (!user) return res.status(400).json({ success: false, message: "Invalid username or password" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ success: false, message: "Login failed" });

      req.session.user = { id: user._id, username: user.username };
      res.status(200).json({ success: true, message: "Login successful", user: req.session.user });
    });
  })(req, res, next);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
