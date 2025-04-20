const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Education Schema
const educationSchema = new Schema({
  level: {
    type: String,
    required: true,
    enum: ["ssc", "hsc", "graduation", "postgraduation"],
  },
  school: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  year: {
    type: Number,
    required: true,
  },
});

// Project Schema
const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: [
    {
      type: String,
    },
  ],
  link: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Certification Schema
const certificationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

// Achievement Schema
const achievementSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

// Profile Schema
const profileSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "studentModel",
  },
  studentModel: {
    type: String,
    required: true,
    enum: ["CE", "CSE", "IT", "SFE", "ME", "EEE", "EC"],
  },
  about: {
    type: String,
    default: "",
  },
  batch: {
    type: String,
    default: "",
  },
  skills: [
    {
      type: String,
    },
  ],
  interests: [
    {
      type: String,
    },
  ],
  achievements: [achievementSchema],
  education: [educationSchema],
  projects: [projectSchema],
  technicalSkills: {
    programmingLanguages: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: String,
      },
    ],
    tools: [
      {
        type: String,
      },
    ],
    certifications: [certificationSchema],
  },
  links: {
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
  },
  profileImage: {
    type: String,
    default: "/api/placeholder/150/150",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
profileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
