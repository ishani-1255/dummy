if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");

// Import models with error handling
let ce, cse, it, sfe, me, eee, ec;
try {
  ce = require("./model/CE");
  cse = require("./model/CSE");
  it = require("./model/IT");
  sfe = require("./model/SFE");
  me = require("./model/ME");
  eee = require("./model/EEE");
  ec = require("./model/EC");
} catch (err) {
  console.error("Error importing models:", err);
}

const adminInfo = require("./model/newAdmin");
const facultyInfo = require("./model/facultySchema");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const { isLoggedIn } = require("./middleware");
const Company = require("./model/companySchema");
const Application = require("./model/applicationSchema");
const Notification = require("./model/notificationSchema");
const Profile = require("./model/profileSchema");

// Load environment variables
const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;
const sessionSecret = process.env.SECRET;

// Middleware Setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Improve CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.FRONTEND_URL || "*",
  ], // Add all possible frontend URLs
  credentials: true, // Allow cookies & sessions to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
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
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: store, // Using the MongoDB store we already configured
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure in production
      // Increase session timeout to 7 days (in milliseconds)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    rolling: true, // Reset expiration on every response
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

        console.log(`Login attempt for ${username} with branch ${branch}`);

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
          console.log(`Invalid branch: ${branch}`);
          return done(null, false, { message: "Invalid branch" });
        }

        // Find the student in the specified branch collection
        let student = await branchModels[branch].findOne({ username });

        // Special handling for SFE branch - try both model names
        if (!student && branch === "SFE") {
          console.log(
            "SFE student not found in Safety model, trying SFE model"
          );
          try {
            // Try the SFE model directly as a fallback
            const SFEModel = mongoose.model("SFE");
            student = await SFEModel.findOne({ username });
            if (student) {
              console.log("Found student in SFE model");
            }
          } catch (modelError) {
            console.error("Error accessing SFE model:", modelError.message);
          }
        }

        if (!student) {
          console.log(`Student ${username} not found in ${branch} collection`);
          return done(null, false, { message: "Invalid username or password" });
        }

        // Check if the student is verified
        console.log(`Student ${username} verified status: ${student.verified}`);
        if (student.verified !== "Yes") {
          return done(null, false, { message: "Account not verified" });
        }

        // Verify password - passport-local-mongoose requires this pattern
        student.authenticate(password, (err, user, passwordError) => {
          if (err) {
            console.error("Authentication error:", err);
            return done(err);
          }

          // Log the authentication result
          console.log(`Password auth result for ${username}: `, {
            user: !!user,
            passwordError: !!passwordError,
            passwordErrorMessage: passwordError?.message,
          });

          // If user is falsy or passwordError exists, authentication failed
          if (!user || passwordError) {
            return done(null, false, {
              message: "Invalid username or password",
            });
          }

          // Success - add branch information to the user object
          user.branch = branch;
          return done(null, user);
        });
      } catch (error) {
        console.error("Student authentication error:", error);
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
    role: role,
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

        // Special handling for SFE branch
        if (!user && userData.branch === "SFE") {
          console.log(
            "SFE student not found during deserialization, trying alternate model"
          );
          try {
            // Try the SFE model directly
            const SFEModel = mongoose.model("SFE");
            user = await SFEModel.findById(userData.id);
          } catch (modelError) {
            console.error(
              "Error accessing SFE model during deserialization:",
              modelError.message
            );
          }
        }
      }
    } else {
      // Fallback: search in all branch collections if branch is not stored
      const branchModels = { ce, cse, it, sfe, me, eee, ec };
      for (const model of Object.values(branchModels)) {
        if (model) {
          user = await model.findById(userData.id);
          if (user) break;
        }
      }

      // If still not found, try directly with SFE model
      if (!user) {
        try {
          const SFEModel = mongoose.model("SFE");
          user = await SFEModel.findById(userData.id);
        } catch (modelError) {
          // Ignore this error
        }
      }
    }

    if (!user) {
      console.log(
        `Failed to deserialize user: ${userData.id}, role: ${userData.role}, branch: ${userData.branch}`
      );
      return done(null, false);
    }

    console.log("🔹 Deserializing User:", user.username);
    // Add role information to the user object
    user = user.toObject();
    user.role = userData.role;

    // Explicitly add branch information if it's a student
    if (userData.role === "student" && userData.branch) {
      user.branch = userData.branch;
    }

    done(null, user);
  } catch (error) {
    console.error("Error during user deserialization:", error);
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
  res.status(200).json({
    success: true,
    message: "You have access to this protected route",
  });
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
      backlog,
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid branch" });
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
      backlog,
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

  console.log(
    `👤 Login attempt: ${username}, role: ${role}, branch: ${branch}`
  );

  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "Role is required" });
  }

  // If role is student, ensure branch is provided
  if (role === "student" && !branch) {
    return res.status(400).json({
      success: false,
      message: "Branch is required for student login",
    });
  }

  // Ensure password is provided
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  passport.authenticate(role, (err, user, info) => {
    if (err) {
      console.error("❌ Passport Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (!user) {
      console.log("❌ Authentication failed:", info);
      return res.status(400).json({
        success: false,
        message: info.message || "Invalid credentials",
      });
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
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      userResponse.role = role;

      console.log(
        `✅ User logged in successfully: ${userResponse.username} (${role})`
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: userResponse,
      });
    });
  })(req, res, next);
});

app.get("/current-user", async (req, res) => {
  // console.log("Current user API hit");
  // console.log("Session:", req.session);
  // console.log("User:", req.user);
  // console.log("Is authenticated:", req.isAuthenticated());

  if (!req.isAuthenticated()) {
    return res
      .status(200)
      .json({ success: false, message: "No user logged in" });
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
            // Also update session
            req.user.branch = branchName;
            break;
          }
        }
      }
    }

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User data not found" });
    }

    // Add role information from session
    user.role = req.user.role;
    if (req.user.branch) {
      user.branch = req.user.branch;
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user data" });
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
      res.clearCookie("connect.sid");
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    });
  });
});

// Get all companies with optional department filter
app.get("/api/companies", async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }

    const companies = await Company.find(query);
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res
      .status(500)
      .json({ message: "Error fetching companies", error: error.message });
  }
});

// Get a single company by ID
app.get("/api/companies/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res
      .status(500)
      .json({ message: "Error fetching company", error: error.message });
  }
});

// Create a new company
app.post("/api/companies", async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    res
      .status(500)
      .json({ message: "Error creating company", error: error.message });
  }
});

// Update a company
app.put("/api/companies/:id", async (req, res) => {
  try {
    // Get the current company data before update
    const currentCompany = await Company.findById(req.params.id);
    if (!currentCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Check which fields were updated
    const updatedFields = [];
    if (
      req.body.description &&
      req.body.description !== currentCompany.description
    ) {
      updatedFields.push("Company Description");
    }
    if (req.body.updates && req.body.updates !== currentCompany.updates) {
      updatedFields.push("Updates");
    }
    if (req.body.package && req.body.package !== currentCompany.package) {
      updatedFields.push("Package");
    }
    if (
      req.body.requirements &&
      req.body.requirements !== currentCompany.requirements
    ) {
      updatedFields.push("Requirements");
    }
    if (
      req.body.visitingDate &&
      new Date(req.body.visitingDate).toISOString() !==
        new Date(currentCompany.visitingDate).toISOString()
    ) {
      updatedFields.push("Visiting Date");
    }

    // If there are any updated fields, create notifications for eligible students
    if (updatedFields.length > 0) {
      // Get all eligible students based on department criteria
      const eligibleDepartments = updatedCompany.department;

      // For each department, find students and create notifications
      for (const dept of eligibleDepartments) {
        const StudentModel =
          dept === "CE"
            ? ce
            : dept === "CSE"
            ? cse
            : dept === "IT"
            ? it
            : dept === "SFE"
            ? sfe
            : dept === "ME"
            ? me
            : dept === "EEE"
            ? eee
            : dept === "EC"
            ? ec
            : null;

        if (StudentModel) {
          const students = await StudentModel.find({});

          // Create notifications for each student
          const notifications = students.map((student) => ({
            student: student._id,
            studentModel: dept,
            type: "company",
            title: `${updatedCompany.name} Update`,
            message: `${
              updatedCompany.name
            } has updated the following: ${updatedFields.join(", ")}`,
            company: updatedCompany._id,
          }));

          if (notifications.length > 0) {
            await Notification.insertMany(notifications);
          }
        }
      }
    }

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    res
      .status(500)
      .json({ message: "Error updating company", error: error.message });
  }
});

// Delete a company
app.delete("/api/companies/:id", async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res
      .status(500)
      .json({ message: "Error deleting company", error: error.message });
  }
});

// Application endpoints
// Create a new application
app.post("/api/applications", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can apply for jobs" });
    }

    const { companyId, resume, coverLetter, additionalInfo } = req.body;

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      student: req.user._id,
      company: companyId,
      studentModel: req.user.branch,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // Create new application
    const newApplication = new Application({
      student: req.user._id,
      studentModel: req.user.branch,
      company: companyId,
      resume,
      coverLetter,
      additionalInfo,
    });

    // Ensure branch is in user object for future requests
    if (!req.user.branch && req.user.role === "student") {
      // Try to determine branch if not already set
      const branchModels = {
        CE: ce,
        CSE: cse,
        IT: it,
        SFE: sfe,
        ME: me,
        EEE: eee,
        EC: ec,
      };

      // Look for user in each collection
      for (const [branchName, model] of Object.entries(branchModels)) {
        const foundUser = await model.findById(req.user._id);
        if (foundUser) {
          req.user.branch = branchName;
          newApplication.studentModel = branchName;
          break;
        }
      }
    }

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    res
      .status(500)
      .json({ message: "Error creating application", error: error.message });
  }
});

// Get applications for current student
app.get("/api/applications", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can view their applications" });
    }

    const applications = await Application.find({
      student: req.user._id,
      studentModel: req.user.branch,
    }).populate("company");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(500)
      .json({ message: "Error fetching applications", error: error.message });
  }
});

// Get a specific application by ID
app.get("/api/applications/:id", isLoggedIn, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "company"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the application belongs to the current user
    if (
      req.user.role === "student" &&
      application.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res
      .status(500)
      .json({ message: "Error fetching application", error: error.message });
  }
});

// Delete an application
app.delete("/api/applications/:id", isLoggedIn, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the application belongs to the current user
    if (
      req.user.role === "student" &&
      application.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res
      .status(500)
      .json({ message: "Error deleting application", error: error.message });
  }
});

// Check if student has applied to a company
app.get("/api/applications/check/:companyId", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can check application status" });
    }

    // Ensure we have the branch information
    if (!req.user.branch) {
      // Try to determine the student's branch
      const branchModels = {
        CE: ce,
        CSE: cse,
        IT: it,
        SFE: sfe,
        ME: me,
        EEE: eee,
        EC: ec,
      };

      for (const [branchName, model] of Object.entries(branchModels)) {
        const foundUser = await model.findById(req.user._id);
        if (foundUser) {
          req.user.branch = branchName;
          break;
        }
      }
    }

    const application = await Application.findOne({
      student: req.user._id,
      company: req.params.companyId,
      studentModel: req.user.branch,
    });

    res.status(200).json({
      hasApplied: !!application,
      application: application,
    });
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({
      message: "Error checking application status",
      error: error.message,
    });
  }
});

// Admin routes for managing applications
// Get all applications for a company
app.get(
  "/api/admin/applications/company/:companyId",
  isLoggedIn,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Unauthorized - Admin access only" });
      }

      // Get all applications for the company without populating student yet
      const applications = await Application.find({
        company: req.params.companyId,
      }).populate("company");

      // For each application, manually fetch the student from the appropriate model
      const populatedApplications = await Promise.all(
        applications.map(async (app) => {
          const appObj = app.toObject();

          // Map studentModel to actual Mongoose model
          const branchModels = {
            CE: ce,
            CSE: cse,
            IT: it,
            SFE: sfe,
            ME: me,
            EEE: eee,
            EC: ec,
          };

          // Get the correct model
          const StudentModel = branchModels[app.studentModel];

          if (StudentModel) {
            // Find the student
            const student = await StudentModel.findById(app.student);
            if (student) {
              appObj.student = student.toObject();
            }
          }

          return appObj;
        })
      );

      res.status(200).json(populatedApplications);
    } catch (error) {
      console.error("Error fetching company applications:", error);
      res.status(500).json({
        message: "Error fetching company applications",
        error: error.message,
      });
    }
  }
);

// Update application status and package by admin
app.put("/api/admin/applications/:id", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    const { status, packageOffered, feedback } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (feedback) updateData.feedback = feedback;
    if ((status === "Accepted" || status === "Offered") && packageOffered)
      updateData.packageOffered = packageOffered;

    // Get the application before updating to check for status change
    const oldApplication = await Application.findById(req.params.id);
    if (!oldApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("company");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // If status is set to Accepted, update the student's placement status
    if (status === "Accepted" && application.student) {
      // Get the appropriate student model based on studentModel
      const branchModels = {};

      // Only add models that exist
      if (ce) branchModels.CE = ce;
      if (cse) branchModels.CSE = cse;
      if (it) branchModels.IT = it;
      if (me) branchModels.ME = me;
      if (eee) branchModels.EEE = eee;
      if (ec) branchModels.EC = ec;
      if (sfe) branchModels.SFE = sfe;

      // Log available models for debugging
      console.log(
        `Available branch models: ${Object.keys(branchModels).join(", ")}`
      );
      console.log(`Student model required: ${application.studentModel}`);

      const StudentModel = branchModels[application.studentModel];

      if (StudentModel) {
        // Update the student's placement details
        await StudentModel.findByIdAndUpdate(application.student, {
          isPlaced: true,
          placementCompany: application.company._id,
          placementPackage: packageOffered || 0,
          placementDate: new Date(),
        });

        console.log(
          `Student ${application.student} marked as placed at ${application.company.name}`
        );
      } else {
        console.warn(
          `Model not found for department: ${application.studentModel}`
        );
      }
    }

    // Create notification for the student if status has changed
    if (oldApplication.status !== status) {
      // Create a notification message based on the new status
      let notificationTitle, notificationMessage;

      if (status === "Under Review") {
        notificationTitle = "Application Under Review";
        notificationMessage = `Your application for ${application.company.name} is now under review.`;
      } else if (status === "Interview Scheduled") {
        notificationTitle = "Interview Scheduled";
        notificationMessage = `Congratulations! You've been selected for an interview with ${application.company.name}.`;
      } else if (status === "Interviewed") {
        notificationTitle = "Interview Completed";
        notificationMessage = `Your interview with ${application.company.name} has been marked as completed.`;
      } else if (status === "Offered") {
        notificationTitle = "Job Offer Received";
        notificationMessage = `Congratulations! You've received a job offer from ${application.company.name}.`;
      } else if (status === "Accepted") {
        notificationTitle = "Application Accepted";
        notificationMessage = `Congratulations! Your application for ${application.company.name} has been accepted with a package of ${packageOffered}.`;
      } else if (status === "Rejected") {
        notificationTitle = "Application Status Update";
        notificationMessage = `We regret to inform you that your application for ${application.company.name} was not selected at this time.`;
      } else {
        notificationTitle = "Application Status Update";
        notificationMessage = `Your application status for ${application.company.name} has been updated to ${status}.`;
      }

      // Create a notification for the student
      await Notification.create({
        student: application.student,
        studentModel: application.studentModel,
        type: "placement",
        title: notificationTitle,
        message: notificationMessage,
        company: application.company._id,
        status: "unread",
      });
    }

    // We need to populate the student data to match the response format expected by the frontend
    const branchModels = {
      CE: ce,
      CSE: cse,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    // Get the correct model
    const StudentModel = branchModels[application.studentModel];
    const appObj = application.toObject();

    if (StudentModel) {
      // Find the student
      const student = await StudentModel.findById(application.student);
      if (student) {
        appObj.student = student.toObject();
      }
    }

    res.status(200).json(appObj);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({
      message: "Error updating application",
      error: error.message,
    });
  }
});

// Notification routes

// Get all notifications for the current student
app.get("/api/notifications", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const notifications = await Notification.find({
      student: req.user._id,
      studentModel: req.user.branch,
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
});

// Mark all notifications as read
app.put("/api/notifications/mark-all-read", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Notification.updateMany(
      {
        student: req.user._id,
        studentModel: req.user.branch,
        status: "unread",
      },
      { status: "read" }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res
      .status(500)
      .json({ message: "Error updating notifications", error: error.message });
  }
});

// Mark a notification as read
app.put("/api/notifications/:id/read", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        student: req.user._id,
        studentModel: req.user.branch,
      },
      { status: "read" },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res
      .status(500)
      .json({ message: "Error updating notification", error: error.message });
  }
});

// Clear all notifications for a student
app.delete("/api/notifications/clear-all", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Notification.deleteMany({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    res.status(200).json({ message: "All notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Error clearing notifications" });
  }
});

// Delete a specific notification
app.delete("/api/notifications/:id", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
});

// Create a test notification (FOR TESTING ONLY)
app.post("/api/test-notification", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { title, message, type } = req.body;

    // Create a test notification for the current student
    const notification = new Notification({
      student: req.user._id,
      studentModel: req.user.branch,
      type: type || "company",
      title: title || "Test Notification",
      message:
        message ||
        "This is a test notification to verify the system is working.",
      status: "unread",
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating test notification:", error);
    res.status(500).json({
      message: "Error creating test notification",
      error: error.message,
    });
  }
});

// Test middleware to check if session is working
app.use((req, res, next) => {
  if (req.originalUrl !== "/api/test" && req.originalUrl !== "/favicon.ico") {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
    );
    console.log("Session ID:", req.sessionID);
    console.log("Is authenticated:", req.isAuthenticated());
    console.log(
      "User:",
      req.user ? `${req.user.username} (${req.user.role})` : "not logged in"
    );
    console.log("-----");
  }
  next();
});

// Student data management routes for admin - TEMPORARILY REMOVED AUTH CHECK
app.get("/api/admin/students/:department", async (req, res) => {
  try {
    console.log(
      "Student data request received for department:",
      req.params.department
    );

    // Check if user is authenticated
    if (req.isAuthenticated()) {
      console.log(
        "User is authenticated:",
        req.user.username,
        "Role:",
        req.user.role
      );
    } else {
      console.log(
        "User is NOT authenticated - proceeding anyway for debugging"
      );
    }

    const { department } = req.params;

    // Map department code to Mongoose model
    const departmentModels = {
      CE: ce,
      CSE: cse,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    // Check if the department is valid
    if (!department || !departmentModels[department]) {
      console.log("Invalid department requested:", department);
      return res.status(400).json({ message: "Invalid department" });
    }

    // Get the students from the specified department
    // console.log(`Fetching students from ${department} collection`);
    const students = await departmentModels[department].find({}).lean();
    // console.log(`Found ${students.length} students in ${department}`);

    return res.status(200).json(students);
  } catch (error) {
    console.error(
      `Error fetching students from ${req.params.department}:`,
      error
    );
    return res.status(500).json({
      message: "Error fetching students",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Query management endpoints
app.post("/api/admin/queries", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    const { studentId, department, field, value } = req.body;

    // Create notification for the student
    // This is simplified - in a real app, you would create a proper query model
    const notification = new Notification({
      student: studentId,
      studentModel: department,
      type: "query",
      title: `Query About ${field}`,
      message: `An administrator has raised a query about your ${field} information.`,
      status: "unread",
    });

    await notification.save();

    res.status(201).json({ message: "Query created successfully" });
  } catch (error) {
    console.error("Error creating query:", error);
    res
      .status(500)
      .json({ message: "Error creating query", error: error.message });
  }
});

app.put("/api/admin/queries/:queryId/resolve", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    const { queryId } = req.params;
    const { studentId } = req.body;

    // In a real app, you would update a query model
    // For now, we'll just create a follow-up notification
    const notification = new Notification({
      student: studentId,
      studentModel: req.body.department || "CSE", // Default to CSE if not provided
      type: "query_resolved",
      title: "Query Resolved",
      message: "Your query has been resolved by an administrator.",
      status: "unread",
    });

    await notification.save();

    res.status(200).json({ message: "Query resolved successfully" });
  } catch (error) {
    console.error("Error resolving query:", error);
    res
      .status(500)
      .json({ message: "Error resolving query", error: error.message });
  }
});

// Simple test endpoint that doesn't require auth
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.status(200).json({ message: "API is working" });
});

// Test endpoint to check auth
app.get("/api/auth-test", isLoggedIn, (req, res) => {
  console.log(
    "Auth test endpoint hit by:",
    req.user?.username,
    "Role:",
    req.user?.role
  );
  res.status(200).json({
    message: "Authentication working",
    user: {
      username: req.user?.username,
      role: req.user?.role,
      isAdmin: req.user?.role === "admin",
    },
  });
});

// Student count endpoint - check if we have data in each model
app.get("/api/admin/students-count", async (req, res) => {
  try {
    console.log("Student count request received");

    const departmentModels = {
      CE: ce,
      CSE: cse,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    const counts = {};

    // Count students in each department
    for (const [dept, model] of Object.entries(departmentModels)) {
      const count = await model.countDocuments();
      counts[dept] = count;
      console.log(`${dept} has ${count} students`);
    }

    return res.status(200).json({ counts });
  } catch (error) {
    console.error("Error counting students:", error);
    return res.status(500).json({
      message: "Error counting students",
      error: error.message,
    });
  }
});

// Test endpoint to create sample student data if none exists
app.get("/api/admin/create-test-data", async (req, res) => {
  try {
    console.log("Request to create test data received");

    // Check if we already have students
    const departmentModels = {
      CSE: cse,
      CE: ce,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    let totalStudents = 0;
    for (const [dept, model] of Object.entries(departmentModels)) {
      const count = await model.countDocuments();
      totalStudents += count;
      console.log(`${dept} has ${count} students`);
    }

    if (totalStudents > 0) {
      return res.status(200).json({
        message: "Test data already exists",
        totalStudents,
      });
    }

    // Create test students for each department
    const testData = [];

    for (const [dept, model] of Object.entries(departmentModels)) {
      // Create 2 test students for each department
      const students = [
        {
          name: `${dept} Test Student 1`,
          email: `student1_${dept.toLowerCase()}@test.com`,
          phone: `9876543210`,
          registrationNumber: `2023${dept}001`,
          branch: dept,
          semester: 4,
          yearOfAdmission: 2023,
          lastSemGPA: 3.7,
          cgpa: 3.8,
          backlog: 0,
          feeDue: false,
          fatherName: "Test Father",
          username: `2023${dept}001`,
          verified: "Yes",
          attendance: 85,
        },
        {
          name: `${dept} Test Student 2`,
          email: `student2_${dept.toLowerCase()}@test.com`,
          phone: `9876543211`,
          registrationNumber: `2023${dept}002`,
          branch: dept,
          semester: 4,
          yearOfAdmission: 2023,
          lastSemGPA: 3.5,
          cgpa: 3.4,
          backlog: 1,
          feeDue: true,
          fatherName: "Test Father",
          username: `2023${dept}002`,
          verified: "Yes",
          attendance: 75,
        },
      ];

      for (const student of students) {
        const newStudent = new model(student);
        // Register with a simple password same as the username
        await model.register(newStudent, student.username);
        testData.push(student);
      }

      console.log(`Created ${students.length} test students for ${dept}`);
    }

    res.status(201).json({
      message: "Test data created successfully",
      studentsCreated: testData.length,
      departments: Object.keys(departmentModels),
    });
  } catch (error) {
    console.error("Error creating test data:", error);
    res.status(500).json({
      message: "Error creating test data",
      error: error.message,
    });
  }
});

// Get placement details for a specific student
app.get(
  "/api/admin/student/:department/:studentId/placement",
  isLoggedIn,
  async (req, res) => {
    try {
      // Only admins should have access to this endpoint
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Unauthorized - Admin access only" });
      }

      const { department, studentId } = req.params;

      // Map department code to Mongoose model
      const departmentModels = {
        CE: ce,
        CSE: cse,
        IT: it,
        SFE: sfe,
        ME: me,
        EEE: eee,
        EC: ec,
      };

      // Check if the department is valid
      if (!department || !departmentModels[department]) {
        return res.status(400).json({ message: "Invalid department" });
      }

      // Get the student from the specified department
      const student = await departmentModels[department]
        .findById(studentId)
        .populate("placementCompany")
        .lean();

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Get all applications for this student with more detailed information
      const applications = await Application.find({
        student: studentId,
        studentModel: department,
      })
        .populate("company")
        .sort({ createdAt: -1 })
        .lean();

      // Enhanced applications with all relevant details
      const enhancedApplications = applications.map((app) => ({
        ...app,
        // Include these fields if they exist
        resume: app.resume || null,
        coverLetter: app.coverLetter || null,
        additionalInfo: app.additionalInfo || null,
        feedback: app.feedback || null,
        responseDate: app.responseDate || null,
        interviewDate: app.interviewDate || null,
        interviewNotes: app.interviewNotes || null,
        interviewFeedback: app.interviewFeedback || null,
        technicalTestScore: app.technicalTestScore || null,
        hrRound: app.hrRound || null,
        aptitudeTestScore: app.aptitudeTestScore || null,
      }));

      // Prepare the response
      const response = {
        student: {
          id: student._id,
          name: student.name,
          registrationNumber: student.registrationNumber,
          branch: student.branch,
          isPlaced: student.isPlaced || false,
          placementCompany: student.placementCompany,
          placementPackage: student.placementPackage,
          placementDate: student.placementDate,
        },
        applications: enhancedApplications,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching placement details:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all placement records (for admin dashboard analytics)
app.get("/api/admin/placements", isLoggedIn, async (req, res) => {
  try {
    // Only admins should have access to this endpoint
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    // Define all department models
    const departmentModels = {
      CE: ce,
      CSE: cse,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    // Array to store all placed students
    let placedStudents = [];

    // Fetch placed students from each department
    for (const [deptCode, Model] of Object.entries(departmentModels)) {
      const students = await Model.find({ isPlaced: true })
        .populate("placementCompany")
        .lean();

      // Transform student data into placement records
      const deptPlacements = students.map((student) => ({
        _id: `${student._id}_placement`,
        studentId: student._id,
        universityId: student.registrationNumber,
        studentName:
          student.name ||
          `${student.firstName || ""} ${student.lastName || ""}`.trim(),
        department: deptCode,
        company: student.placementCompany,
        package: student.placementPackage || 0,
        role: student.placementRole || "Not specified",
        location: student.placementLocation || "Not specified",
        joiningDate: student.placementDate
          ? new Date(student.placementDate).toISOString().split("T")[0]
          : null,
        offerLetterLink: student.offerLetterLink || null,
        createdAt: student.placementDate || student.updatedAt || new Date(),
      }));

      placedStudents = [...placedStudents, ...deptPlacements];
    }

    // Also get placements from the applications collection
    const acceptedApplications = await Application.find({ status: "Accepted" })
      .populate("company")
      .populate("student")
      .lean();

    // Map applications to placement records, avoiding duplicates
    const existingStudentIds = new Set(
      placedStudents.map((p) => p.studentId.toString())
    );

    const applicationPlacements = acceptedApplications
      .filter(
        (app) => !existingStudentIds.has(app.student?._id?.toString() || "")
      )
      .map((app) => ({
        _id: `${app._id}_application`,
        studentId: app.student?._id || app.student || null,
        universityId: app.student?.registrationNumber || "Unknown",
        studentName: app.student?.name || app.studentName || "Unknown Student",
        department: app.studentModel,
        company: app.company,
        package: app.packageOffered || 0,
        role: app.role || "Not specified",
        location: app.location || "Not specified",
        joiningDate: app.acceptedDate
          ? new Date(app.acceptedDate).toISOString().split("T")[0]
          : null,
        offerLetterLink: null,
        createdAt: app.updatedAt || app.createdAt || new Date(),
      }));

    // Combine both sets of placement data
    const allPlacements = [...placedStudents, ...applicationPlacements];

    // Sort by most recent first
    allPlacements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(allPlacements);
  } catch (error) {
    console.error("Error fetching placement records:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all companies for admin dashboard
app.get("/api/admin/companies", isLoggedIn, async (req, res) => {
  try {
    // Only admins should have access to this endpoint
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    // Fetch all companies
    const companies = await Company.find({})
      .select("name location companyType createdAt status")
      .lean();

    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all students for admin dashboard with pagination
app.get("/api/admin/students", isLoggedIn, async (req, res) => {
  try {
    // Only admins should have access to this endpoint
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Default to 1000 students per page
    const skip = (page - 1) * limit;

    // Define all department models
    const departmentModels = {
      CE: ce,
      CSE: cse,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    // Array to store all students
    let allStudents = [];

    // Fetch students from each department
    for (const [deptCode, Model] of Object.entries(departmentModels)) {
      const students = await Model.find({})
        .select(
          "_id registrationNumber name firstName lastName department yearOfAdmission isPlaced placementCompany placementPackage placementDate"
        )
        .populate("placementCompany", "name")
        .lean();

      // Add department code to each student
      const deptStudents = students.map((student) => ({
        ...student,
        department: deptCode,
      }));

      allStudents = [...allStudents, ...deptStudents];
    }

    // Get total count for pagination
    const totalStudents = allStudents.length;

    // Apply pagination
    const paginatedStudents = allStudents.slice(skip, skip + limit);

    res.status(200).json(paginatedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get students from a specific department
app.get("/api/admin/students/:department", isLoggedIn, async (req, res) => {
  try {
    // Only admins should have access to this endpoint
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    const { department } = req.params;

    // Map department code to Mongoose model
    const departmentModels = {
      CE: ce,
      CSE: cse,
      IT: it,
      SFE: sfe,
      ME: me,
      EEE: eee,
      EC: ec,
    };

    // Check if the department is valid
    if (!department || !departmentModels[department]) {
      return res.status(400).json({ message: "Invalid department" });
    }

    // Get the students from the specified department
    const students = await departmentModels[department]
      .find({})
      .select(
        "_id registrationNumber name firstName lastName yearOfAdmission isPlaced placementCompany placementPackage placementDate"
      )
      .populate("placementCompany", "name")
      .lean();

    // Add department code to each student
    const deptStudents = students.map((student) => ({
      ...student,
      department,
    }));

    res.status(200).json(deptStudents);
  } catch (error) {
    console.error(
      `Error fetching students from ${req.params.department}:`,
      error
    );
    res.status(500).json({ message: "Server error" });
  }
});

// Student accepts a job offer
app.put(
  "/api/student/applications/:id/accept",
  isLoggedIn,
  async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const applicationId = req.params.id;

      // Find the application, but don't populate the student to avoid the schema error
      const application = await Application.findById(applicationId).populate(
        "company"
      );

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Verify that this application belongs to the logged-in student
      // Use the student ID directly instead of populated object
      if (application.student.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You can only accept your own applications" });
      }

      // Verify that the application status is "Offered"
      if (application.status !== "Offered") {
        return res.status(400).json({
          message: "Only applications with 'Offered' status can be accepted",
        });
      }

      const oldApplication = { ...application.toObject() };

      // Update the application status
      application.status = "Accepted";
      await application.save();

      // Get the appropriate student model based on studentModel
      const branchModels = {};

      // Only add models that exist
      if (ce) branchModels.CE = ce;
      if (cse) branchModels.CSE = cse;
      if (it) branchModels.IT = it;
      if (me) branchModels.ME = me;
      if (eee) branchModels.EEE = eee;
      if (ec) branchModels.EC = ec;
      if (sfe) branchModels.SFE = sfe;

      // Log available models for debugging
      console.log(
        `Available branch models: ${Object.keys(branchModels).join(", ")}`
      );
      console.log(`Student model required: ${application.studentModel}`);

      const StudentModel = branchModels[application.studentModel];

      if (StudentModel) {
        try {
          // Update the student's placement details
          await StudentModel.findByIdAndUpdate(application.student, {
            isPlaced: true,
            placementCompany: application.company._id,
            placementPackage: application.packageOffered || 0,
            placementDate: new Date(),
          });

          console.log(
            `Student ${application.student} marked as placed at ${application.company.name}`
          );
        } catch (modelError) {
          console.error(`Error updating student model: ${modelError.message}`);
          // Continue execution even if this fails
        }
      } else {
        console.warn(
          `Model not found for department: ${application.studentModel}`
        );
      }

      // Create a notification for the student
      try {
        await Notification.create({
          student: application.student,
          studentModel: application.studentModel,
          type: "placement",
          title: "Offer Accepted",
          message: `You have successfully accepted the job offer from ${application.company.name} with a package of ₹${application.packageOffered}.`,
          company: application.company._id,
          status: "unread",
        });
      } catch (notifError) {
        console.error(`Error creating notification: ${notifError.message}`);
        // Continue execution even if notification creation fails
      }

      // Return the updated application without trying to populate the student
      res.status(200).json(application);
    } catch (error) {
      console.error("Error accepting offer:", error);
      res.status(500).json({
        message: "Error accepting offer",
        error: error.message,
      });
    }
  }
);

// Student declines a job offer
app.put(
  "/api/student/applications/:id/decline",
  isLoggedIn,
  async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const applicationId = req.params.id;

      // Find the application, but don't populate the student to avoid the schema error
      const application = await Application.findById(applicationId).populate(
        "company"
      );

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Verify that this application belongs to the logged-in student
      if (application.student.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You can only decline your own applications" });
      }

      // Verify that the application status is "Offered"
      if (application.status !== "Offered") {
        return res.status(400).json({
          message: "Only applications with 'Offered' status can be declined",
        });
      }

      // Update the application status
      application.status = "Declined";
      application.responseDate = new Date(); // Record when the student declined
      await application.save();

      // Create a notification for the student
      try {
        await Notification.create({
          student: application.student,
          studentModel: application.studentModel,
          type: "placement",
          title: "Offer Declined",
          message: `You have declined the job offer from ${application.company.name}.`,
          company: application.company._id,
          status: "unread",
        });
      } catch (notifError) {
        console.error(`Error creating notification: ${notifError.message}`);
        // Continue execution even if notification creation fails
      }

      // Return the updated application
      res.status(200).json(application);
    } catch (error) {
      console.error("Error declining offer:", error);
      res.status(500).json({
        message: "Error declining offer",
        error: error.message,
      });
    }
  }
);

// Admin endpoint to fix SFE model issues
app.get("/api/admin/fix-sfe-model", async (req, res) => {
  try {
    // Only admin can access this
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Get all students from Safety model
    const SafetyModel = mongoose.model("Safety");
    const students = await SafetyModel.find({});

    console.log(`Found ${students.length} students in Safety model`);

    let migratedCount = 0;
    let failedCount = 0;

    // Attempt to register them in SFE model
    try {
      const SFEModel = mongoose.model("SFE");

      for (const student of students) {
        try {
          // Check if student already exists in SFE model
          const exists = await SFEModel.findOne({ username: student.username });
          if (!exists) {
            // Create new document in SFE model
            const newSFEStudent = new SFEModel(student.toObject());
            await newSFEStudent.save();
            migratedCount++;
          } else {
            console.log(
              `Student ${student.username} already exists in SFE model`
            );
          }
        } catch (err) {
          console.error(`Failed to migrate student ${student.username}:`, err);
          failedCount++;
        }
      }
    } catch (modelError) {
      return res.status(500).json({
        message: "Error accessing SFE model",
        error: modelError.message,
      });
    }

    res.status(200).json({
      message: "SFE model fix attempted",
      totalStudents: students.length,
      migratedCount,
      failedCount,
    });
  } catch (error) {
    console.error("Error fixing SFE model:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==========================================
// Student Profile Routes
// ==========================================

// Get student profile
app.get("/api/student/profile", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Find the profile for the current student
    const profile = await Profile.findOne({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!profile) {
      // If no profile exists yet, create a default one
      const newProfile = new Profile({
        student: req.user._id,
        studentModel: req.user.branch,
        about: "Passionate student with interest in technology.",
        batch: `${new Date().getFullYear() - req.user.semester / 2}-${
          new Date().getFullYear() - req.user.semester / 2 + 4
        }`,
        skills: [],
        interests: [],
        achievements: [],
        education: [],
        projects: [],
        technicalSkills: {
          programmingLanguages: [],
          technologies: [],
          tools: [],
          certifications: [],
        },
        links: {
          linkedin: "",
          github: "",
          portfolio: "",
        },
      });

      await newProfile.save();
      return res.status(200).json(newProfile);
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

// Create or update student profile
app.put("/api/student/profile", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const {
      about,
      batch,
      skills,
      interests,
      achievements,
      education,
      projects,
      technicalSkills,
      links,
    } = req.body;

    // Find and update profile, or create if it doesn't exist
    const profile = await Profile.findOneAndUpdate(
      {
        student: req.user._id,
        studentModel: req.user.branch,
      },
      {
        about,
        batch,
        skills,
        interests,
        achievements,
        education,
        projects,
        technicalSkills,
        links,
        updatedAt: Date.now(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
});

// Add or update profile education
app.post("/api/student/profile/education", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { id, level, school, board, percentage, year } = req.body;

    // Find the profile
    const profile = await Profile.findOne({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (id) {
      // Update existing education
      const educationIndex = profile.education.findIndex(
        (edu) => edu._id.toString() === id
      );

      if (educationIndex === -1) {
        return res.status(404).json({ message: "Education entry not found" });
      }

      profile.education[educationIndex] = {
        _id: profile.education[educationIndex]._id,
        level,
        school,
        board,
        percentage,
        year,
      };
    } else {
      // Add new education
      profile.education.push({
        level,
        school,
        board,
        percentage,
        year,
      });
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating education:", error);
    res.status(500).json({
      message: "Error updating education",
      error: error.message,
    });
  }
});

// Delete education
app.delete(
  "/api/student/profile/education/:id",
  isLoggedIn,
  async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const profile = await Profile.findOne({
        student: req.user._id,
        studentModel: req.user.branch,
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Remove the education with the specified ID
      profile.education = profile.education.filter(
        (edu) => edu._id.toString() !== req.params.id
      );

      await profile.save();
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error deleting education:", error);
      res.status(500).json({
        message: "Error deleting education",
        error: error.message,
      });
    }
  }
);

// Add or update project
app.post("/api/student/profile/project", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { id, title, description, technologies, link } = req.body;

    // Find the profile
    const profile = await Profile.findOne({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (id) {
      // Update existing project
      const projectIndex = profile.projects.findIndex(
        (proj) => proj._id.toString() === id
      );

      if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found" });
      }

      profile.projects[projectIndex] = {
        _id: profile.projects[projectIndex]._id,
        title,
        description,
        technologies,
        link,
        createdAt: profile.projects[projectIndex].createdAt,
      };
    } else {
      // Add new project
      profile.projects.push({
        title,
        description,
        technologies,
        link,
      });
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      message: "Error updating project",
      error: error.message,
    });
  }
});

// Delete project
app.delete("/api/student/profile/project/:id", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const profile = await Profile.findOne({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Remove the project with the specified ID
    profile.projects = profile.projects.filter(
      (proj) => proj._id.toString() !== req.params.id
    );

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      message: "Error deleting project",
      error: error.message,
    });
  }
});

// Add or update skill
app.post("/api/student/profile/skill", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { category, skill, index, certData } = req.body;

    // Find the profile
    const profile = await Profile.findOne({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Handle based on category
    if (category === "skills") {
      // General skills
      if (index !== undefined) {
        // Update existing skill
        profile.skills[index] = skill;
      } else {
        // Add new skill
        profile.skills.push(skill);
      }
    } else if (category === "certifications") {
      // Certifications
      if (index !== undefined) {
        // Update existing certification
        profile.technicalSkills.certifications[index] = certData;
      } else {
        // Add new certification
        profile.technicalSkills.certifications.push(certData);
      }
    } else {
      // Other technical skills (programmingLanguages, technologies, tools)
      if (index !== undefined) {
        // Update existing skill
        profile.technicalSkills[category][index] = skill;
      } else {
        // Add new skill
        profile.technicalSkills[category].push(skill);
      }
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({
      message: "Error updating skill",
      error: error.message,
    });
  }
});

// Delete skill
app.delete("/api/student/profile/skill", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { category, index } = req.body;

    const profile = await Profile.findOne({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Handle based on category
    if (category === "skills") {
      // Remove the skill at the specified index
      profile.skills.splice(index, 1);
    } else if (category === "certifications") {
      // Remove the certification at the specified index
      profile.technicalSkills.certifications.splice(index, 1);
    } else {
      // Remove other technical skills
      profile.technicalSkills[category].splice(index, 1);
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({
      message: "Error deleting skill",
      error: error.message,
    });
  }
});

// Add or update achievement
app.post("/api/student/profile/achievement", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { id, title, date } = req.body;

    // Find the profile
    const profile = await Profile.findOne({
      student: req.user._id,
      studentModel: req.user.branch,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (id) {
      // Update existing achievement
      const achievementIndex = profile.achievements.findIndex(
        (ach) => ach._id.toString() === id
      );

      if (achievementIndex === -1) {
        return res.status(404).json({ message: "Achievement not found" });
      }

      profile.achievements[achievementIndex] = {
        _id: profile.achievements[achievementIndex]._id,
        title,
        date,
      };
    } else {
      // Add new achievement
      profile.achievements.push({
        title,
        date,
      });
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating achievement:", error);
    res.status(500).json({
      message: "Error updating achievement",
      error: error.message,
    });
  }
});

// Delete achievement
app.delete(
  "/api/student/profile/achievement/:id",
  isLoggedIn,
  async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const profile = await Profile.findOne({
        student: req.user._id,
        studentModel: req.user.branch,
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Remove the achievement with the specified ID
      profile.achievements = profile.achievements.filter(
        (ach) => ach._id.toString() !== req.params.id
      );

      await profile.save();
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error deleting achievement:", error);
      res.status(500).json({
        message: "Error deleting achievement",
        error: error.message,
      });
    }
  }
);

// **Server Listener**
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
