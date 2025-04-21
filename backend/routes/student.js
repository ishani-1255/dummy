const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Import all student models
const CSE = require("../model/CSE");
const EC = require("../model/EC");
const EEE = require("../model/EEE");
const ME = require("../model/ME");
const CE = require("../model/CE");
const IT = require("../model/IT");
const SFE = require("../model/SFE");

// Map of branch codes to their models
const branchModels = {
  CSE,
  EC,
  EEE,
  ME,
  CE,
  IT,
  SFE,
};

// For debugging - log each model's collection name
Object.entries(branchModels).forEach(([branch, model]) => {
  console.log(`Model for ${branch}:`, {
    collectionName: model.collection.name,
    modelName: model.modelName,
  });
});

// Generic verification route for all branches
router.post("/:branch/verify", async (req, res) => {
  try {
    const { branch } = req.params;
    const { email, username } = req.body;

    console.log("Verification attempt for:", { branch, email, username });

    // Get the appropriate model based on branch
    const StudentModel = branchModels[branch];

    if (!StudentModel) {
      console.log("Invalid branch specified:", branch);
      console.log("Available branches:", Object.keys(branchModels));

      return res.status(400).json({
        success: false,
        message: `Invalid branch specified: ${branch}. Available branches: ${Object.keys(
          branchModels
        ).join(", ")}`,
      });
    }

    // For debugging: Log collection and model info
    console.log(`Using model for branch ${branch}:`, {
      collectionName: StudentModel.collection.name,
      modelName: StudentModel.modelName,
    });

    // Find student by username (this is what passport-local-mongoose uses)
    // Note: In your app, you're using username for authentication, not email
    console.log("Searching for student with username:", username);

    const student = await StudentModel.findOne({ username });

    console.log("Student found by username:", !!student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found. Please check your username.",
      });
    }

    // Now check if the email matches
    console.log("Checking email match:", {
      providedEmail: email,
      storedEmail: student.email,
      matches: email === student.email,
    });

    if (email !== student.email) {
      return res.status(404).json({
        success: false,
        message: "Email does not match records for this username.",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Student verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
});

// Generic password update route for all branches
router.post("/:branch/update-password", async (req, res) => {
  try {
    const { branch } = req.params;
    const { email, username, newPassword } = req.body;

    // Get the appropriate model based on branch
    const StudentModel = branchModels[branch];

    if (!StudentModel) {
      console.log("Invalid branch specified:", branch);
      return res.status(400).json({
        success: false,
        message: `Invalid branch specified: ${branch}`,
      });
    }

    // Find student by username
    const student = await StudentModel.findOne({ username });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found. Please check your username.",
      });
    }

    // Verify email matches
    if (email !== student.email) {
      return res.status(404).json({
        success: false,
        message: "Email does not match records for this username.",
      });
    }

    // For passport-local-mongoose, we need to use setPassword
    student.setPassword(newPassword, async (err) => {
      if (err) {
        console.error("Error setting password:", err);
        return res.status(500).json({
          success: false,
          message: "Error updating password",
        });
      }

      await student.save();
      console.log("Password updated successfully");
      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during password update",
    });
  }
});

// Add a test route for debugging
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Student API is working",
    branches: Object.keys(branchModels),
    branchDetails: Object.entries(branchModels).map(([branch, model]) => ({
      branch,
      collectionName: model.collection.name,
      modelName: model.modelName,
    })),
  });
});

// Export the router
module.exports = router;
