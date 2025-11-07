const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  // Patient demographic/medical details
  dob: { type: Date },
  age: { type: Number },
  bloodGroup: { type: String },
  gender: { type: String },
  otherHealthIssues: { type: String }, // freeform list (diabetes, bp, etc.)
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
