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
const { isLoggedIn } = require('./middleware');

// Load environment variables
const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;
const sessionSecret = process.env.SECRET;

// Middleware Setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
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
      sameSite: 'lax', // For better cookie security
      // Only set secure to true in production environment with HTTPS
      secure: process.env.NODE_ENV === 'production'
    },
  })
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

// **Passport Local Strategy for Admin**
passport.use("admin", adminInfo.createStrategy());

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
        
        // Add branch information to the student object for serialization
        student.branch = branch;
        
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
  // Determine user role
  let role = "student";
  if (user.collection && user.collection.name.includes("admin")) {
    role = "admin";
  }
  
  // Save branch information for students
  const userData = {
    id: user._id,
    role: role
  };
  
  // If it's a student, store the branch
  if (role === "student" && user.branch) {
    userData.branch = user.branch;
  }
  
  done(null, userData);
});

passport.deserializeUser(async (userData, done) => {
  try {
    let user = null;

    if (userData.role === "admin") {
      user = await adminInfo.findById(userData.id);
    } else if (userData.role === "student" && userData.branch) {
      // Get the correct model based on branch
      const branchModels = {
        CE: ce,
        CSE: cse,
        IT: it,
        SFE: sfe,
        ME: me,
        EEE: eee,
        EC: ec,
      };
      
      const StudentModel = branchModels[userData.branch];
      if (StudentModel) {
        user = await StudentModel.findById(userData.id);
      }
    } else {
      // Fallback: search in all branch collections if branch is not stored
      const branchModels = { ce, cse, it, sfe, me, eee, ec };
      for (const model of Object.values(branchModels)) {
        user = await model.findById(userData.id);
        if (user) break;
      }
    }

    if (!user) return done(null, false);
    
    console.log("🔹 Deserializing User:", user.username);
    // Add role information to the user object
    user = user.toObject();
    user.role = userData.role;
    
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to make user info available globally
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

// Example of a protected route
app.get("/protected-route", isLoggedIn, (req, res) => {
  res.status(200).json({ success: true, message: "You have access to this protected route" });
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
      CSE: cse,
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
app.post("/login", async (req, res, next) => {
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

    req.logIn(user, async (err) => {
      if (err) {
        console.error("❌ Login Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Login failed" });
      }

      // Create a simplified user object for the client
      const userResponse = await (async () => {
        if (role === "admin") {
          return await adminInfo.findById(user._id).lean();
        } else if (role === "student" && branch) {
          const branchModels = {
        CE: ce,
        CSE: cse,
        IT: it,
        SFE: sfe,
        ME: me,
        EEE: eee,
        EC: ec,
          };
          const StudentModel = branchModels[branch];
          return await StudentModel.findById(user._id).lean();
        }
        return null;
      })();

      if (!userResponse) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      userResponse.role = role;

      console.log("User logged in:", userResponse);

      res.status(200).json({ 
        success: true, 
        message: "Login successful", 
        user: userResponse
      });
    });
  })(req, res, next);
});

// Route to get currently logged-in user
// Route to get currently logged-in user
app.get("/current-user", async (req, res) => {
  console.log("Current user API hit");
  console.log("Session:", req.session);
  console.log("User:", req.user);
  console.log("Is authenticated:", req.isAuthenticated());

  if (!req.isAuthenticated()) {
    return res.status(200).json({ success: false, message: "No user logged in" });
  }

  try {
    // Create a simplified user object
    let user = null;
    
    if (req.user.role === "admin") {
      user = await adminInfo.findById(req.user._id).lean();
    } else if (req.user.role === "student") {
      const branchModels = {
        CE: ce,
        CSE: cse,
        IT: it,
        SFE: sfe,
        ME: me,
        EEE: eee,
        EC: ec,
      };
      
      // Use branch from session if available
      const branch = req.user.branch;
      if (branch && branchModels[branch]) {
        const StudentModel = branchModels[branch];
        user = await StudentModel.findById(req.user._id).lean();
      } else {
        // Fallback: search in all collections if needed
        for (const [branchName, model] of Object.entries(branchModels)) {
          const foundUser = await model.findById(req.user._id).lean();
          if (foundUser) {
            user = foundUser;
            // Store branch for future reference
            user.branch = branchName;
            break;
          }
        }
      }
    }

    if (!user) {
      return res.status(200).json({ success: false, message: "User data not found" });
    }

    // Add role information from session
    user.role = req.user.role;
    if (req.user.branch) {
      user.branch = req.user.branch;
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ success: false, message: "Error fetching user data" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      console.log("🔵 Logged out successfully");
      // Clear the cookie on client side
      res.clearCookie('connect.sid');
      res.status(200).json({ success: true, message: "Logged out successfully" });
    });
  });
});

// **Server Listener**
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});