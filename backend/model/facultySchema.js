const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); // Import the plugin

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: String, required: true },
    accessCode: { type: String, required: true, unique: true },
    
});

module.exports = mongoose.model("FacultyAccess", facultySchema);




