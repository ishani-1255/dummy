const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  accessCode: { type: String },
});

adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("adminInfo", adminSchema);
