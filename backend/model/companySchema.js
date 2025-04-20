const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  visitingDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  requirements: {
    type: String,
  },
  updates: {
    type: String,
    default: "",
    // Field for company updates, interview notifications, etc.
  },
  package: {
    type: String,
    required: true,
  },
  department: {
    type: [String],
    required: true,
    enum: ["CE", "CSE", "IT", "SFE", "ME", "EEE", "EC"],
  },
  batch: {
    type: [String],
    required: true,
    // Array of batches like "2022-2026", "2023-2027"
  },
  minimumCgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  backlogsAllowed: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
