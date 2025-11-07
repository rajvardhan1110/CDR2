// models/Domain.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

const domainSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  description: { type: String, required: true },
  questions: [questionSchema],
});

module.exports = mongoose.model("Domain", domainSchema);
