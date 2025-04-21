const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  author: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const querySchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    default: "CSE",
  },
  department: {
    type: String,
    default: "CSE",
  },
  regNo: {
    type: String,
    default: "CS2022",
  },
  registrationNumber: {
    type: String,
  },
  admissionYear: {
    type: String,
    default: "2022",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "General",
      "Interview Preparation",
      "Documents",
      "Interview Process",
      "Job Offers",
      "Technical",
    ],
    default: "General",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema],
  repliesRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Query", querySchema);
