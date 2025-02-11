const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const studentSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  roll: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
});

studentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("studentInfo", studentSchema);
