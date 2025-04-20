const express = require("express");
const router = express.Router();
const Admin = require("../model/newAdmin");
const bcrypt = require("bcrypt");

// Log model info for debugging
console.log("Admin model:", {
  collectionName: Admin.collection.name,
  modelName: Admin.modelName,
});

// Verify admin for password reset
router.post("/verify", async (req, res) => {
  try {
    const { email, username } = req.body;

    console.log("Admin verification attempt:", { email, username });

    // Find admin by username
    const admin = await Admin.findOne({ username });
    console.log("Admin found by username:", !!admin);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found. Please check your username.",
      });
    }

    // Now check if the email matches
    console.log("Checking email match:", {
      providedEmail: email,
      storedEmail: admin.email,
      matches: email === admin.email,
    });

    if (email !== admin.email) {
      return res.status(404).json({
        success: false,
        message: "Email does not match records for this username.",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
});

// Update admin password
router.post("/update-password", async (req, res) => {
  try {
    const { email, username, newPassword } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found. Please check your username.",
      });
    }

    // Verify email matches
    if (email !== admin.email) {
      return res.status(404).json({
        success: false,
        message: "Email does not match records for this username.",
      });
    }

    // For passport-local-mongoose, use setPassword
    admin.setPassword(newPassword, async (err) => {
      if (err) {
        console.error("Error setting password:", err);
        return res.status(500).json({
          success: false,
          message: "Error updating password",
        });
      }

      await admin.save();
      console.log("Admin password updated successfully");

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
    message: "Admin API is working",
    model: {
      collectionName: Admin.collection.name,
      modelName: Admin.modelName,
    },
  });
});

module.exports = router;
