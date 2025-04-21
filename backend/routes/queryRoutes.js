const express = require("express");
const router = express.Router();
const Query = require("../model/querySchema");
const { isAuthenticated } = require("../middleware");

// Get all queries (admin only)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    // Check if user is admin (simple check - you might have a more robust solution)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching queries", error: error.message });
  }
});

// Get queries for a specific student
router.get("/student", isAuthenticated, async (req, res) => {
  try {
    // Check different possible locations for the student ID
    const studentId = req.user.id || req.user._id || req.user.studentId;

    if (!studentId) {
      return res
        .status(400)
        .json({ message: "Could not determine student ID" });
    }

    const queries = await Query.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student queries",
      error: error.message,
    });
  }
});

// Create a new query (students)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Check different possible locations for user information
    const studentId = req.user.id || req.user._id || req.user.studentId;
    const studentName =
      req.user.name ||
      req.user.username ||
      req.user.firstName ||
      (req.user.firstName && req.user.lastName
        ? `${req.user.firstName} ${req.user.lastName}`
        : "Student");

    // Get branch, department, and registration information
    const branch = req.user.branch || req.user.department || "CSE";
    const regNo = req.user.regNo || req.user.registrationNumber || "CS2022";
    const admissionYear =
      req.user.admissionYear || req.user.yearOfAdmission || "2022";

    if (!studentId) {
      return res
        .status(400)
        .json({ message: "Could not determine student ID" });
    }

    const newQuery = new Query({
      studentId,
      studentName,
      branch,
      regNo,
      admissionYear,
      title,
      description,
      category: category || "General",
      status: "pending",
      priority: "normal",
      favorite: false,
      createdAt: Date.now(),
      replies: [],
      repliesRead: true, // Initially true as there are no replies yet
    });

    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    console.error("Error creating query:", error);
    res
      .status(500)
      .json({ message: "Error creating query", error: error.message });
  }
});

// Add a reply to a query
router.post("/:id/reply", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    console.log(
      `Received reply request for query ${id} with message: ${message}`
    );

    if (!message) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Get user ID from different possible locations
    const userId = req.user.id || req.user._id || req.user.studentId;
    console.log(
      `User ID from request: ${userId}, Query student ID: ${query.studentId}`
    );

    // Only allow the student who created the query or admins to reply
    if (req.user.role !== "admin" && userId != query.studentId) {
      return res
        .status(403)
        .json({ message: "Not authorized to reply to this query" });
    }

    const authorName =
      req.user.role === "admin"
        ? "Admin"
        : req.user.name || req.user.username || query.studentName;

    const newReply = {
      message,
      isAdmin: req.user.role === "admin",
      author: authorName,
      timestamp: Date.now(),
    };

    console.log("Creating new reply:", newReply);

    // Update status to in-progress if admin replies to a pending query
    let status = query.status;
    if (req.user.role === "admin" && query.status === "pending") {
      status = "in-progress";
    }

    // Mark replies as unread if admin is replying (for student to see)
    // or mark as read if student is replying (they've obviously read it)
    const repliesRead = req.user.role === "admin" ? false : true;

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        $push: { replies: newReply },
        status,
        repliesRead,
      },
      { new: true }
    );

    console.log("Updated query with new reply:", updatedQuery);
    res.status(200).json(updatedQuery);
  } catch (error) {
    console.error("Error adding reply:", error);
    res
      .status(500)
      .json({ message: "Error adding reply", error: error.message });
  }
});

// Update query status (admin and student who created the query)
router.put("/:id/status", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    // Get user ID from different possible locations
    const userId = req.user.id || req.user._id || req.user.studentId;

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Allow both admin and the student who created the query to change status
    // But only allow student to mark as resolved, not change to other statuses
    if (req.user.role !== "admin" && userId !== query.studentId) {
      return res.status(403).json({
        message:
          "Access denied. You don't have permission to update this query.",
      });
    }

    // If user is student and not admin, they can only mark as resolved
    if (req.user.role !== "admin" && status !== "resolved") {
      return res
        .status(403)
        .json({ message: "Students can only mark queries as resolved" });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedQuery);
  } catch (error) {
    console.error("Error updating query status:", error);
    res
      .status(500)
      .json({ message: "Error updating query status", error: error.message });
  }
});

// Toggle favorite status for a student's query
router.put("/:id/favorite", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // Get user ID from different possible locations
    const userId = req.user.id || req.user._id || req.user.studentId;

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Only the student who created the query can toggle favorite
    if (userId !== query.studentId) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this query" });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { favorite: !query.favorite },
      { new: true }
    );

    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(500).json({
      message: "Error toggling favorite status",
      error: error.message,
    });
  }
});

// Delete a query
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Check if the user is the owner of the query or an admin
    if (
      req.user.role === "admin" ||
      query.studentId === (req.user.id || req.user._id)
    ) {
      await Query.findByIdAndDelete(id);
      return res.status(200).json({ message: "Query deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this query" });
    }
  } catch (error) {
    console.error("Error deleting query:", error);
    res
      .status(500)
      .json({ message: "Error deleting query", error: error.message });
  }
});

module.exports = router;
