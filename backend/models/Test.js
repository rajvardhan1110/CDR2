const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Caretaker details captured at test start
  caretaker: {
    name: String,
    gender: String,
    age: Number,
    mobile: String,
    email: String,
    relation: String,
  },
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
  answers: [
    {
      qId: String,
      rating: Number,
    }
  ],
  score: Number,
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
