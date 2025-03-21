const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "studentModel",
    required: true,
  },
  studentModel: {
    type: String,
    required: true,
    enum: ["CE", "CSE", "IT", "SFE", "ME", "EEE", "EC"],
  },
  type: {
    type: String,
    required: true,
    enum: ["company", "interview", "placement", "other"],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["read", "unread"],
    default: "unread",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
