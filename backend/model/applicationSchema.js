const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
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
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  resume: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      "Applied",
      "Under Review",
      "Interview Scheduled",
      "Interviewed",
      "Offered",
      "Rejected",
      "Accepted",
      "Declined",
    ],
    default: "Applied",
  },
  interviewDate: {
    type: Date,
  },
  feedback: {
    type: String,
  },
  packageOffered: {
    type: String,
    // Will contain the package offered to the student when status is "Accepted"
  },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
