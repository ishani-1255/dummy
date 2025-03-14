if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const ce = require("./model/CE");
const cse = require("./model/CSE");
const it = require("./model/IT");
const sfe = require("./model/SFE");
const me = require("./model/ME");
const eee = require("./model/EEE");
const ec = require("./model/EC");
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

// **Passport Local Strategy for Admin**
passport.use("admin", adminInfo.createStrategy());

// **Custom Passport Local Strategy for Student**
// **Custom Passport Local Strategy for Student**
passport.use(
  "student",
  new LocalStrategy(
    {
      usernameField: "username", // Field name for username in the request body
      passwordField: "password", // Field name for password in the request body
      passReqToCallback: true, // Pass the request object to the callback
    },
    async (req, username, password, done) => {
      try {
        const { branch } = req.body; // Get branch from the request body

        // Define the branch models
        const branchModels = {
          CE: ce,
          CSE: cse,
          IT: it,
          SFE: sfe,
          ME: me,
          EEE: eee,
          EC: ec,
        };

        // Check if the branch is valid
        if (!branch || !branchModels[branch]) {
          return done(null, false, { message: "Invalid branch" });
        }

        // Find the student in the specified branch collection
        const student = await branchModels[branch].findOne({ username });

        if (!student) {
          return done(null, false, { message: "Invalid username or password" });
        }

        // Check if the student is verified
        if (student.verified !== "Yes") {
          return done(null, false, { message: "Account not verified" });
        }

        // Verify password
        const isValidPassword = await student.authenticate(password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, student);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize & Deserialize properly for multiple strategies
passport.serializeUser((user, done) => {
  console.log("🔹 Serializing User:", user.username);
  done(null, {
    id: user._id,
    role: user.role || (user.collection.name.includes("admin") ? "admin" : "student"),
  });
});

passport.deserializeUser(async (userData, done) => {
  try {
    let user = null;

    if (userData.role === "admin") {
      user = await adminInfo.findById(userData.id);
    } else {
      // Find the student in all branch collections
      const branchModels = { ce, cse, it, sfe, me, eee, ec };
      for (const model of Object.values(branchModels)) {
        user = await model.findById(userData.id);
        if (user) break; // Exit loop if user is found
      }
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
      registrationNumber,
      branch,
      semester,
      yearOfAdmission,
      lastSemGPA,
      cgpa,
      feeDue,
      fatherName,
    } = req.body;

    const username = registrationNumber;
    const password = registrationNumber;

    // Mapping of branch names to their respective models
    const branchModels = {
      CSE: cse, // Ensure "CSE" matches the branch value in the request body
      CE: ce,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    // Debugging: Log the branch and StudentModel
    console.log("Branch:", branch);
    const StudentModel = branchModels[branch];
    console.log("StudentModel:", StudentModel);

    if (!StudentModel) {
      return res.status(400).json({ success: false, message: "Invalid branch" });
    }

    // Check if the username already exists
    const existingUser = await StudentModel.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    // Create a new student
    const newStudent = new StudentModel({
      name,
      email,
      phone,
      registrationNumber,
      branch,
      semester,
      yearOfAdmission,
      lastSemGPA,
      cgpa,
      feeDue,
      fatherName,
      username,
      verified: "No", // Default to "No" for new students
    });

    // Register the student with passport-local-mongoose
    await StudentModel.register(newStudent, password);

    res
      .status(201)
      .json({ success: true, message: "Student registered successfully" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// **Login Route**
app.post("/login", (req, res, next) => {
  const { username, password, role, branch } = req.body;

  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "Role is required" });
  }

  // If role is student, ensure branch is provided
  if (role === "student" && !branch) {
    return res
      .status(400)
      .json({ success: false, message: "Branch is required for student login" });
  }

  passport.authenticate(role, (err, user, info) => {
    if (err) {
      console.error("❌ Passport Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (!user) {
      console.log("❌ Authentication failed:", info);
      return res
        .status(400)
        .json({ success: false, message: info.message || "Invalid credentials" });
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
        branch: role === "student" ? branch : null, // Include branch only for students
      };

      res
        .status(200)
        .json({ success: true, message: "Login successful", user: req.session.user });
    });
  })(req, res, next);
});

// Route to get currently logged-in user
app.get("/current-user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "No user logged in" });
  }

  res.status(200).json({ success: true, user: req.session.user });
});

// **Server Listener**
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});