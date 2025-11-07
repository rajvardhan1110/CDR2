const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const Test = require("../models/Test");
const Question = require("../models/Domain");
const router = express.Router();

// GET all questions
router.get("/questions", async (req, res) => {
  try {
    const data = await Question.find();
    res.json({ questions: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START a new test
// Require caretaker.email and caretaker.relation; store caretaker details on the test record
router.post("/start", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { caretaker } = req.body || {};

  // Basic validation: caretaker must include email and relation
  if (!caretaker || !caretaker.email || !caretaker.relation) {
    return res.status(400).json({ error: "caretaker.email and caretaker.relation are required" });
  }

  try {
    // coerce age to number if present
    if (caretaker.age) caretaker.age = Number(caretaker.age);
    const test = await Test.create({ userId, caretaker });
    res.json({ testId: test._id, startedAt: test.startedAt, test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUBMIT test answers
router.post("/submit", authMiddleware, async (req, res) => {
  const { testId, answers } = req.body;
  if (!testId || !answers)
    return res.status(400).json({ error: "testId and answers required" });

  try {
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: "Test not found" });

    test.answers = answers;
    test.finishedAt = new Date();
    test.score = answers.reduce((acc, a) => acc + (Number(a.rating) || 0), 0);
    await test.save();

    res.json({ testId: test._id, finishedAt: test.finishedAt, score: test.score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE partial answers (merge/update answers without finishing)
router.post("/save", authMiddleware, async (req, res) => {
  const { testId, answers } = req.body; // answers: array of { qId, rating }
  if (!testId || !answers) return res.status(400).json({ error: "testId and answers required" });

  try {
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: "Test not found" });
    if (test.userId.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    // merge incoming answers into existing answers array
    const map = new Map();
    (test.answers || []).forEach((a) => map.set(a.qId, a.rating));
    (answers || []).forEach((a) => map.set(a.qId, Number(a.rating) || 0));

    // rebuild answers array preserving order from existing test or from incoming order
    const merged = Array.from(map.entries()).map(([qId, rating]) => ({ qId, rating }));
    test.answers = merged;
    await test.save();

    res.json({ test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user’s tests
router.get("/my-tests", authMiddleware, async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single test result by id
router.get("/results/:id", authMiddleware, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    // Ensure the requesting user owns the test
    if (test.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    res.json({ test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
